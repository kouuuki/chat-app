import Login from "@/components/Login";
import UnauthorizedLayout from "@/components/layouts/unauthorized";

export default function LoginPage() {
  return (
    <UnauthorizedLayout>
      <Login />
    </UnauthorizedLayout>
  );
}
