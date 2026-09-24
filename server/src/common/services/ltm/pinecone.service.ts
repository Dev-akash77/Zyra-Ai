import * as dotenv from "dotenv";
dotenv.config();

import { Injectable } from "@nestjs/common";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

@Injectable()
export class PineconeLtmService {
  private pinecone: Pinecone;
  private embeddings: GoogleGenerativeAIEmbeddings;
  // 1. Index name from .env or fallback
  private indexName = process.env.PINECONE_INDEX || "zyra-memory";

  constructor() {
    // Initialize Pinecone client
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || "",
    });

    // 2. Initialize Gemini Embeddings (fixed 'text-embedding-004')
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GOOGLE_API_KEY,
    });
  }

  // SAVE MEMORY: Converts text to a vector and stores it in Pinecone
  async saveMemory(userId: string, factText: string) {
    try {
      console.log(`\n💾 [Pinecone LTM] Vectorizing and saving: "${factText}"`);

      // 1. Convert text to 768-dimension vector
      const vector = await this.embeddings.embedQuery(factText);
      const index = this.pinecone.index(this.indexName);

      // 2. Upsert into Pinecone with metadata
      await index.upsert([
        {
          id: `mem-${userId}-${Date.now()}`,
          values: vector,
          metadata: {
            userId: userId,
            text: factText,
            createdAt: new Date().toISOString(),
          },
        },
      ]);

      console.log(`✅ [Pinecone LTM] Saved to vector database.`);
    } catch (e) {
      console.error(`❌ [Pinecone LTM] Error saving memory:`, e);
    }
  }

  // RECALL MEMORY: Searches Pinecone for semantically relevant memories
  async recallMemories(userId: string, query: string, topK: number = 3): Promise<string> {
    try {
      console.log(`\n[Pinecone LTM] Querying vector memories for: "${query}"`);

      // Convert user's question into a vector
      const queryVector = await this.embeddings.embedQuery(query);
      const index = this.pinecone.index(this.indexName);

      // Query Pinecone for the closest vector matches for this user
      const queryResponse = await index.query({
        vector: queryVector,
        topK: topK,
        includeMetadata: true,
        filter: {
          userId: { $eq: userId }, // Multi-tenant: Only search this user's memories!
        },
      });

      if (!queryResponse.matches || queryResponse.matches.length === 0) {
        return "No relevant past memories found.";
      }

      // Extract the text from top matching memories
      const retrievedFacts = queryResponse.matches
        .filter((match) => (match.score || 0) > 0.6)
        .map((match) => `- ${match.metadata?.text}`)
        .join("\n");

      console.log(`[Pinecone LTM] Relevant facts retrieved:\n${retrievedFacts}`);
      return retrievedFacts || "No closely matching memories.";
    } catch (error) {
      console.error(` [Pinecone LTM] Error retrieving memory:`, error);
      return "Memory retrieval unavailable.";
    }
  }
}

// 3. Removed the trailing '0'
export const pineconeLtm = new PineconeLtmService();