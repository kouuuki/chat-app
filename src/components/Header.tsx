import { auth } from "@/libs/firebase";
import Image from "next/image";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";

type Props = {
  name: string;
  imageUrl?: string;
};

export default function Header({ name, imageUrl }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="mx-3 my-3 flex items-center justify-between">
      <div className="flex items-center">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="プロフィール画像"
            width={50}
            height={50}
            className="mr-2 h-10 w-10 rounded-full object-cover"
          />
        )}
        <p>{name}</p>
      </div>
      <div>
        <button onClick={handleLogout}>ログアウト</button>
      </div>
    </div>
  );
}
