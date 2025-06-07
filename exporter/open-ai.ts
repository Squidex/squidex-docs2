import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";

export function createEmbeddings() {
    const openAIApiKey = process.env.OPENAI_APIKEY;

    const embeddings = new OpenAIEmbeddings({
        openAIApiKey,
        modelName: 'text-embedding-3-large'
    });

    return embeddings;
}

export function createModel() {
    const openAIApiKey = process.env.OPENAI_APIKEY;

    const model = new OpenAI({ 
        temperature: 0,
        openAIApiKey,
        modelName: 'gpt-3.5-turbo-0125'
    });

    return model;
}