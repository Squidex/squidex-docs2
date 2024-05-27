import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { createEmbeddings } from "./open-ai.js";

export async function createVectorStore() {
    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_APIKEY!,
    });
    
    const embeddings = createEmbeddings();

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);
    const pineconeStore = new PineconeStore(embeddings, { pineconeIndex });

    return { store: pineconeStore, index: pineconeIndex };
}