import { ChatPromptTemplate } from "@langchain/core/prompts";
import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { MarkdownTextSplitter } from "langchain/text_splitter";
import { createVectorStore } from "./vector-store.js";
import { getFileCached } from "./cache.js";
import { createModel } from "./open-ai.js";
import 'dotenv/config';

console.log('Downloading files');
const docs = await getFileCached('docs', async () => {
    const loader = new GithubRepoLoader('https://github.com/squidex/squidex-docs2', {
        branch: 'master',
        accessToken: process.env.GITHUB_TOKEN
    });

    return await loader.load();
});
console.log(`Downloading files done. Cached: ${docs.cached}\n`);

console.log('Enriching documents');
const enrichedDocs = await getFileCached('enriched', async () => {
    const summarizePrompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a world class technical documentation writer."],
        ["system", "Summarize the following text and write exactly 5 typical questions that are answered by the text."],
        ["user", "{pageContent}"],
    ]);

    const summarizeModel = createModel();
    const summarizeChain = summarizePrompt.pipe(summarizeModel);

    const result: { pageContent: string, metadata: any }[] = [];

    for (const doc of docs.result) {
        let { metadata, pageContent } = doc;

        const summary = await summarizeChain.invoke({
            pageContent
        });

        pageContent += '\n';
        pageContent += summary;

        const enriched = { pageContent, metadata };

        result.push(enriched);
    }

    return result;
});
console.log(`Enriching documents done. Cached: ${enrichedDocs.cached}\n`);

console.log('Splitting documents');
const splittedDocs = await getFileCached('splitted', async () => {
    const splitter = new MarkdownTextSplitter();

    return await splitter.splitDocuments(enrichedDocs.result);
});
console.log(`Splitting documents done. Cached: ${splittedDocs.cached}\n`);

const withAppName = splittedDocs.result.map(d => {
    const { pageContent, metadata } = d;

    return {
        pageContent,
        metadata: {
            appName: 'squidex',
            ...metadata
        },
    };
});

const { store, index } = await createVectorStore();

console.log('Deleting documents');
await index.deleteAll();
console.log('Deleting done\n');

console.log('Inserting documents');
await store.addDocuments(withAppName);
console.log('Inserting done');