import Head from "next/head";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { firestore as db } from "@/libs/firebase";
import { useEffect, useState } from "react";
import useCurrentUser from "@/hooks/useFirebaseCurrentUser";
import { Message } from "@/types/firestore";
import { createMessage } from "@/libs/firestore/messages";
import { getChannel } from "@/libs/firestore/channels";
import { MyMessage, OtherMessage } from "@/components/Message";
import { Channel } from "@/types/firestore";

type Props = {
  channelId: string;
  channel: Channel | null;
};

export default function Messages({ channelId, channel }: Props) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    const messageRef = collection(db, "messages");
    const createListener = () => {
      const q = query(
        messageRef,
        where("channel", "==", channelId),
        orderBy("createdAt"),
        limit(10)
      );

      return onSnapshot(q, (querySnapshot) => {
        const newMessages: Message[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          newMessages.push({
            text: data.text,
            user: data.user,
            channel: data.channel,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        });
        setMessages(newMessages);
      });
    };

    const listener = createListener();

    return () => listener();
  }, []);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const sendMessage = async () => {
    if (message.length === 0) return;
    await createMessage(message, currentUser.uid, channelId);
    setMessage("");
  };

  return (
    <>
      <Head>
        <title>Chat App</title>
        <meta name="description" content="Chat App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="block lg:col-span-2">
        <div className="w-full bg-white">
          <div className="relative flex items-center border-b border-gray-300 p-3">
            <span className="ml-2 block font-bold text-gray-600">
              {channel?.title}
            </span>
          </div>
          <div className="relative h-[40rem] w-full overflow-y-auto p-6">
            <ul className="space-y-2">
              {messages.map((message) => {
                if (message.user === currentUser.uid) {
                  return <MyMessage text={message.text} key={message.text} />;
                } else {
                  return (
                    <OtherMessage text={message.text} key={message.text} />
                  );
                }
              })}
            </ul>
          </div>
          <div className="flex w-full items-center justify-between border-t border-gray-300 p-3">
            <input
              type="text"
              placeholder="メッセージ"
              className="mr-3 block w-full rounded-full bg-gray-100 py-2 pl-4 outline-none focus:text-gray-700"
              name="message"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage} type="submit">
              <svg
                className="h-5 w-5 origin-center rotate-90 transform text-blue-400 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({
  query,
}: {
  query: { id: string };
}): Promise<{ props: Props }> {
  const channel = await getChannel(query.id);
  return {
    props: {
      channelId: query.id,
      channel,
    },
  };
}
