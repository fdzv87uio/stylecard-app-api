import { connectMongoose } from "@/utils/connectMongoose";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    startDbConnection();
  }, []);

  async function startDbConnection() {
    await connectMongoose().catch((error: any) => console.log(error));
    console.log("MongoDB Connected...")
  }
  return <Component {...pageProps} />;
}
