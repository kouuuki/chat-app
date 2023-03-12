import { useState, ChangeEvent } from "react";
import { auth, storage } from "@/libs/firebase";
import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";
import { createUserProfile } from "@/libs/firestore/users";

type FormValues = {
  email: string;
  password: string;
  name: string;
};

export default function Account() {
  const [file, setFile] = useState<File | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    password: "",
    name: "",
  });
  const handleChange = (
    event: ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
      | HTMLInputElement
    >
  ) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const uploadImage = async (user: User, file: File) => {
    const storageRef = ref(
      storage,
      `users/${user.uid}/profile-image/${"test"}`
    );
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password
      );
      const user = userCredential.user;
      const imageUrl = file ? await uploadImage(user, file) : "";
      await createUserProfile(user, formValues.name, imageUrl);
    } catch (error) {}
  };

  return (
    <div className="login h-screen bg-cover font-sans">
      <div className="container mx-auto flex h-full flex-1 items-center justify-center">
        <div className="w-full max-w-lg">
          <div className="leading-loose">
            <form
              className="m-4 mx-auto max-w-sm rounded bg-white bg-opacity-25 p-10 shadow-xl"
              onSubmit={handleSubmit}
            >
              <p className="text-center text-lg font-medium font-bold text-white">
                新規登録
              </p>
              <div className="mt-4" />
              <div>
                <input
                  className="w-full rounded bg-gray-300 px-5 py-1 text-gray-700 focus:bg-white focus:outline-none"
                  type="file"
                  id="file"
                  placeholder="File"
                  aria-label="file"
                  onChange={(event: React.FormEvent) => {
                    const files = (event.target as HTMLInputElement).files;

                    if (files && files.length > 0) {
                      setFile(files[0]);
                    }
                  }}
                />
              </div>
              <div className="mt-4">
                <input
                  className="w-full rounded bg-gray-300 px-5 py-1 text-gray-700 focus:bg-white focus:outline-none"
                  type="name"
                  id="name"
                  name="name"
                  placeholder="Name"
                  arial-label="Name"
                  required
                  value={formValues.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mt-4">
                <input
                  className="w-full rounded bg-gray-300 px-5 py-1 text-gray-700 focus:bg-white focus:outline-none"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  aria-label="email"
                  required
                  value={formValues.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mt-4">
                <input
                  className="w-full rounded bg-gray-300 px-5 py-1 text-gray-700 focus:bg-white focus:outline-none"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  arial-label="password"
                  required
                  value={formValues.password}
                  onChange={handleChange}
                />
              </div>
              <div className="mt-4 text-center">
                <button
                  className="rounded bg-gray-900 px-4 py-1 font-light tracking-wider text-white hover:bg-gray-800"
                  type="submit"
                >
                  新規登録
                </button>
                <Link className="mt-2 block text-white" href="/login">
                  ログイン
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
