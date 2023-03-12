import Head from "next/head";
import useCurrentUser from "@/hooks/useFirebaseCurrentUser";
import Spinner from "@/components/Spinner";
import Account from "@/components/Account";
import { useRouter } from "next/router";

export default function Home() {
  const { currentUser, isLoading } = useCurrentUser();
  const router = useRouter();

  if (isLoading) {
    return <Spinner />;
  }

  if (currentUser) {
    router.push("/messages");
    return;
  }

  return (
    <>
      <Head>
        <title>Chat App</title>
        <meta name="description" content="Chat App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Account />
    </>
  );
}
