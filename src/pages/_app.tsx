import { connectMongoose } from "@/utils/connectMongoose";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import "../styles/globals.css";
import { ThemeProvider } from "@mui/material";
import { defaultTheme } from "@/themes/defaultTheme";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    startDbConnection();
  }, []);

  async function startDbConnection() {
    await connectMongoose().catch((error: any) => console.log(error));
    console.log("MongoDB Connected...")
  }
  return (
    <ThemeProvider theme={defaultTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
