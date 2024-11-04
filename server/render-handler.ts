import type { UniversalHandler } from "@universal-middleware/core";
import { renderPage } from "vike/server";

export const renderHandler = (async (request, context, runtime): Promise<Response> => {
  const DB = runtime.env.DB;
  const pageContextInit = { ...context, urlOriginal: request.url, ...runtime };
  const key = request.url.replace(/.*\?key=/, '');

  const pageData = JSON.parse(await DB.get(key));
  console.log(pageData);

  pageContextInit.pageData = pageData;

  const pageContext = await renderPage(pageContextInit);
  const response = pageContext.httpResponse;

  const { readable, writable } = new TransformStream();

  response?.pipe(writable);

  return new Response(readable, {
    status: response?.statusCode,
    headers: response?.headers,
  });
}) satisfies UniversalHandler;

