import {
  addDoc,
  collection,
  updateDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { firestore as db } from "@/libs/firebase";
import { Channel } from "@/types/firestore";

export async function createChannel(title: string) {
  try {
    const docRef = await addDoc(collection(db, "channels"), {
      title,
    });
    updateDoc(docRef, {
      channelId: docRef.id,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating channel", error);
  }
}

export async function getChannel(channelId: string) {
  try {
    const channelRef = doc(db, "channels", channelId);
    const channelDoc = await getDoc(channelRef);
    if (channelDoc.exists()) {
      return channelDoc.data() as Channel;
    }
    return null;
  } catch (error) {
    console.error("Error get channel", error);
    return null;
  }
}

export async function fetchChannels(channelIds: string[]) {
  try {
    const channelsQuery = query(
      collection(db, "channels"),
      where("channelId", "in", channelIds)
    );
    const channelsSnapshot = await getDocs(channelsQuery);
    return channelsSnapshot.docs.map((doc) => {
      return doc.data() as Channel;
    });
  } catch (error) {
    console.error("Error fetch channels", error);
    return [];
  }
}
