import { useState, ChangeEvent } from "react";
import { auth } from "@/libs/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";

type FormValues = {
  email: string;
  password: string;
};

export default function Login() {
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    password: "",
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password
      );
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
                ログイン
              </p>
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
                  ログイン
                </button>
                <Link className="mt-2 block text-white" href="/">
                  新規登録
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
