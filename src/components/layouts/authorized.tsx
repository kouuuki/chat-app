import Head from "next/head";
import useCurrentUser from "@/hooks/useFirebaseCurrentUser";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";

type Props = {
  children: JSX.Element;
};
export default function AuthorizedLayout({ children }: Props) {
  const { currentUser, isLoading } = useCurrentUser();
  const router = useRouter();

  if (isLoading) {
    return <Spinner />;
  }

  if (currentUser) {
    router.push("/messages");
    return <Spinner />;
  }
  return (
    <>
      <Head>
        <title>Chat App | メッセージ</title>
        <meta name="description" content="Chat App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </>
  );
}
