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
    console.log(userUid);
    const userRef = doc(db, "users", userUid);
    const userDoc = await getDoc(userRef);
    console.log("AAAAAAA", userDoc);
    if (userDoc.exists()) {
      console.log("BBBBB");
      return userDoc.data() as UserType;
    }
    console.log("CCCCCC");
    return null;
  } catch (error) {
    console.error("user not exist", error);
    return null;
  }
}
