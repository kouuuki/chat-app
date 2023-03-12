import {
  doc,
  collection,
  writeBatch,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firestore as db } from "@/libs/firebase";

const batch = writeBatch(db);

export async function createUserChannel(userIds: string[], channelId: string) {
  try {
    const collectionRef = collection(db, "userChannels");

    userIds.forEach((item) => {
      const docRef = doc(collectionRef);
      batch.set(docRef, { user: item, channel: channelId });
    });

    await batch.commit();
  } catch (error) {
    console.error("Error creating channel", error);
  }
}

export async function fetchUserChannels(userUid: string) {
  try {
    const userChannelsQuery = query(
      collection(db, "userChannels"),
      where("user", "==", userUid)
    );
    const querySnapshot = await getDocs(userChannelsQuery);
    return querySnapshot.docs.map((doc) => {
      return doc.data();
    });
  } catch (error) {
    console.error("Error creating channel", error);
    return [];
  }
}
