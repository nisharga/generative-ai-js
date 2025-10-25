import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { loadDocuments } from "./loadDocuments";

export async function splitDocuments(
  rawDocuments: Promise<Document>[]
): Promise<Document[]> {
  const splitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
    chunkSize: 500,
    chunkOverlap: 100
  });

  const documentChunks = await splitter.splitDocuments(rawDocuments as any);
  console.log(`${rawDocuments.length} documents split into ${documentChunks.length} chunks.`);

  return documentChunks;
}

// const rawDocuments = await loadDocuments();
// await splitDocuments(rawDocuments as any);