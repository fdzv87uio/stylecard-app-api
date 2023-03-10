import Head from "next/head";
import { Inter } from "next/font/google";
import { useSession, signIn } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <>
      <p>Stylecard Web App / API</p>
    </>
  );
}
