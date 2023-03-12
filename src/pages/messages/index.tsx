import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Modal from "react-modal";
import useCurrentUser from "@/hooks/useFirebaseCurrentUser";
import { fetchChannels, createChannel } from "@/libs/firestore/channels";
import {
  fetchUserChannels,
  createUserChannel,
} from "@/libs/firestore/userChannels";
import { Channel, User } from "@/types/firestore";
import Header from "@/components/Header";
import { getUser } from "@/libs/firestore/users";
import Spinner from "@/components/Spinner";

export default function Messages() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useCurrentUser();
  const [channels, setChannels] = useState<any>([]);
  const [user, setUser] = useState<User | null>(null);

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    async function init(userUid: string) {
      const user = await getUser(userUid);
      setUser(user);
    }

    if (currentUser) {
      init(currentUser.uid);
    }
  }, [currentUser]);

  useEffect(() => {
    async function init(userUid: string) {
      const userChannels = await fetchUserChannels(userUid);
      const channelIds: any = userChannels.map((userChannel) => {
        return userChannel.channel;
      });
      if (channelIds.length === 0) return false;
      const channelsData = await fetchChannels(channelIds);
      setChannels(channelsData);
    }

    if (currentUser) {
      init(currentUser.uid);
    }
  }, [currentUser]);

  if (!user) {
    return <Spinner />;
  }

  const handleCreateChannel = async (e: any) => {
    e.preventDefault();
    const channelId = await createChannel("hogepiyo");
    if (currentUser && channelId) {
      createUserChannel([currentUser.uid], channelId);
    }
  };

  return (
    <>
      <Head>
        <title>Chat App</title>
        <meta name="description" content="Chat App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto bg-white">
        <Modal
          isOpen={isOpen}
          onRequestClose={handleClose}
          contentLabel="Example Modal"
        >
          <form className="h-full w-full">
            <input />
            <button onClick={handleCreateChannel} type="submit">
              作成
            </button>
          </form>
        </Modal>
        <div className="min-w-full rounded border">
          <div className="border-r border-gray-300">
            <Header name={user.name} imageUrl={user.imageUrl} />
            <div className="mx-3 my-3">
              <div className="relative text-gray-600">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-gray-300"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="search"
                  className="block w-full rounded bg-gray-100 py-2 pl-10 outline-none"
                  name="search"
                  placeholder="Search"
                  required
                />
              </div>
            </div>
            <button
              className="mx-3 block rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
              data-modal-toggle="default-modal"
              onClick={handleClick}
            >
              T
            </button>
            <ul className="h-[32rem] overflow-auto">
              <h2 className="my-2 mb-2 ml-3 text-lg text-gray-600">Chats</h2>
              {channels.map((a: Channel) => {
                return (
                  <li key={a.title}>
                    <Link
                      href={`/messages/${a.channelId}`}
                      className="flex cursor-pointer items-center border-b border-gray-300 px-3 py-2 text-sm transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none"
                    >
                      <div className="w-full pb-2">
                        <div className="flex justify-between">
                          <span className="ml-2 block font-semibold text-gray-600">
                            {a.title}
                          </span>
                          <span className="ml-2 block text-sm text-gray-600">
                            25 minutes
                          </span>
                        </div>
                        <span className="ml-2 block text-sm text-gray-600">
                          {a.lastSendedMessage}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
