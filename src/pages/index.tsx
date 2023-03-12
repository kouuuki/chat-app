import Account from "@/components/Account";
import UnauthorizedLayout from "@/components/layouts/unauthorized";

export default function Home() {
  return (
    <UnauthorizedLayout>
      <Account />
    </UnauthorizedLayout>
  );
}
