import dotenv from "dotenv";
import { loadDocuments } from "./loadDocuments";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import cliProgress from "cli-progress";
import { splitDocuments } from "./splitDocument";

dotenv.config();

// load document
const rawDocuments = await loadDocuments();

// chunk document
const chunkedDocuments = await splitDocuments(rawDocuments as any);

// embedding model 
const embeddingLLM = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

// vectorization and vector db
const pinecone = new Pinecone();

const pineconeIndex = pinecone.index("vector-test");

console.log("Starting Vecrotization...");
const progressBar = new cliProgress.SingleBar({});
progressBar.start(chunkedDocuments.length, 0);

for (let i = 0; i < chunkedDocuments.length; i = i + 100) {
  const batch = chunkedDocuments.slice(i, i + 100);
  await PineconeStore.fromDocuments(batch, embeddingLLM, {
    pineconeIndex,
  });

  progressBar.increment(batch.length);
}

progressBar.stop();
console.log("Chunked documents stored in pinecone.");
