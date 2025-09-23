import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { action } from "./_generated/server";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

export const ingest = action({
  args: {
    splitText: v.array(v.string()),
    fileId: v.string()
  },
  handler: async (ctx, args) => {
    const docsWithMetadata = args.splitText.map((text) => ({
      pageContent: text,
      metadata: { fileId: args.fileId }
    }));

    await ConvexVectorStore.fromDocuments(
      docsWithMetadata,
      new GoogleGenerativeAIEmbeddings({
        apiKey: 'AIzaSyClctmdwF-3qu4jiDv52qSvJOhfyws8dT0',
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );

    return "completed";
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string()
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey: 'AIzaSyClctmdwF-3qu4jiDv52qSvJOhfyws8dT0',
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );

    const resultOne = await (await vectorStore.similaritySearch(args.query, 1))
    .filter(q=>q.metadata.fileId==args.fileId)
    console.log(resultOne);
    
    return JSON.stringify(resultOne);
    
  },
});
