import { User } from "firebase/auth";
import { firestore as db } from "@/libs/firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { User as UserType } from "@/types/firestore";

export async function createUserProfile(
  user: User,
  name: string,
  imageUrl: string
) {
  try {
    await setDoc(doc(db, "users", user.uid), {
      user: user.uid,
      name,
      imageUrl,
    });
  } catch (error) {
    console.error("Error creating user profile", error);
  }
}

export async function getUser(userUid: string) {
  try {
    const userRef = doc(db, "users", userUid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data() as UserType;
    }
    return null;
  } catch (error) {
    return null;
  }
}
