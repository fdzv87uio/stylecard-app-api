import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_SECRET_KEY,
});

let openAiConnection: any = null;

export async function ConnectOpenAi() {
  if (!openAiConnection) {
    openAiConnection = new OpenAIApi(configuration);
    return openAiConnection;
  } else {
    return openAiConnection;
  }
}
