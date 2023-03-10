import { signIn } from "next-auth/react";

interface userLoginProps {
  email: string;
  password: string;
}

export default async function userLogin({ email, password }: userLoginProps) {
  const res = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });
  return res;
}
