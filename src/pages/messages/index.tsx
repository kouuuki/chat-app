import { useState, useEffect } from "react";
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
import { useSearchChannels } from "@/hooks/useSearchChannels";

export default function Messages() {
  const [openSuggestion, setOpenSuggestion] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useCurrentUser();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const results = useSearchChannels(searchTerm);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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
      const channelIds: string[] = userChannels.map((userChannel) => {
        return userChannel.channel;
      });
      if (channelIds.length === 0) return false;
      const channelsData = await fetchChannels(channelIds);
      setChannels(channelsData);
    }

    if (currentUser) {
      init(currentUser.uid);
    }
  }, [currentUser, isOpen]);

  if (!user) {
    return <Spinner />;
  }

  const handleCreateChannel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const channelId = await createChannel(channelName);
    if (currentUser && channelId) {
      await createUserChannel([currentUser.uid], channelId);
      setIsOpen(false);
      setChannelName("");
    }
  };

  const joinChannel = async (channelId: string) => {
    if (currentUser) {
      await createUserChannel([currentUser.uid], channelId);
      setOpenSuggestion(false);
    }
  };

  return (
    <div className="container mx-auto bg-white">
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Example Modal"
      >
        <form className="h-full w-full" onSubmit={handleCreateChannel}>
          <h2 className="font-bold">チャンネルを作成</h2>
          <div className="mt-4" />
          <input
            required
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
            id="title"
            maxLength={30}
            type="text"
            placeholder="チャンネル名"
          />
          <div className="mt-4" />
          <button
            className="focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
            type="submit"
          >
            作成
          </button>
        </form>
      </Modal>
      <div className="min-w-full rounded border">
        <div className="border-r border-gray-300">
          <Header name={user.name} imageUrl={user.imageUrl} />
          <div className="relative mx-3 my-3">
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
                onFocus={() => setOpenSuggestion(true)}
                type="search"
                className="block w-full rounded bg-gray-100 py-2 pl-10 outline-none"
                name="search"
                placeholder="チャンネルを検索"
                required
                onChange={handleInputChange}
              />
            </div>
            <div
              className={`absolute flex w-full border border-gray-300 bg-white p-4 ${
                openSuggestion ? "block" : "hidden"
              }`}
            >
              <ul className="w-full">
                {results
                  .filter(
                    (e) => !channels.map((c) => c.channelId).includes(e.id)
                  )
                  .map((e, i) => {
                    return (
                      <li
                        key={`${i}-${e.title}`}
                        className="w-full border-b-2 border-neutral-100 border-opacity-100 py-4 dark:border-opacity-50"
                      >
                        <button
                          onClick={() => joinChannel(e.id)}
                          className="w-full text-left"
                        >
                          {e.title}
                        </button>
                      </li>
                    );
                  })}
              </ul>
              <button
                onClick={() => setOpenSuggestion(false)}
                className="absolute top-4 right-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-x"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M18 6l-12 12" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <button
            className="mx-3 rounded-full bg-blue-700 p-2 text-center text-sm font-medium text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
            data-modal-toggle="default-modal"
            onClick={() => setIsOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <ul className="h-[32rem] overflow-auto">
            <h2 className="my-2 mb-2 ml-3 text-lg text-gray-600">
              参加中のチャンネル
            </h2>
            {channels.map((a: Channel, i: number) => {
              return (
                <li key={`${i}${a.title}`}>
                  <Link
                    href={`/messages/${a.channelId}`}
                    className="flex cursor-pointer items-center border-b border-gray-300 px-3 py-2 text-sm transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none"
                  >
                    <div className="w-full pb-2">
                      <div className="flex justify-between">
                        <span className="ml-2 block font-semibold text-gray-600">
                          {a.title}
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
  );
}
