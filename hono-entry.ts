import { createHandler } from "@universal-middleware/hono";
import { Hono } from "hono";
import { createChapterHandler, keyHandler, renderMergeImagesHandler, uploadToCaptureHandler } from "./server/create-chapter-handler";
import { vikeHandler } from "./server/vike-handler";
import { renderHandler } from "./server/render-handler";

const app = new Hono();

app.get("/read", createHandler(() => renderHandler)());
app.get("/render", createHandler(() => renderHandler)());
app.get("/render-merge-images", createHandler(() => renderMergeImagesHandler)());

app.post("/api/create-chapter", createHandler(() => createChapterHandler)());
app.post("/api/upload-chapter", createHandler(() => uploadToCaptureHandler)());
app.get("/api/key", createHandler(() => keyHandler)());

/**
 * Vike route
 *
 * @link {@see https://vike.dev}
 **/
app.all("*", createHandler(() => vikeHandler)());

export default app;
