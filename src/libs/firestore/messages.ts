import { addDoc, collection } from "firebase/firestore";
import { firestore as db } from "@/libs/firebase";

const messageRef = collection(db, "messages");

export async function createMessage(
  message: string,
  userUid: string,
  channelId: string
) {
  try {
    await addDoc(messageRef, {
      text: message,
      user: userUid,
      channel: channelId,
      createdAt: new Date().getTime(),
    });
  } catch (error) {
    console.error("Error creating message", error);
  }
}
