import * as dotenv from "dotenv";
dotenv.config();

import { ChatGroq } from "@langchain/groq";

export const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0,
});