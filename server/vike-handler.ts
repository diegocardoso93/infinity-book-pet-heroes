import { renderPage } from "vike/server";
import type { UniversalHandler } from "@universal-middleware/core";
import { Heroes } from "./heroes";

export const vikeHandler = (async (request, context, runtime): Promise<Response> => {
  console.log('vikehandler');
  const pageContextInit = { ...context, urlOriginal: request.url, ...runtime };

  pageContextInit.pageData = {
    heroes: Heroes
  };

  const pageContext = await renderPage(pageContextInit);
  const response = pageContext.httpResponse;

  const { readable, writable } = new TransformStream();

  response?.pipe(writable);

  return new Response(readable, {
    status: response?.statusCode,
    headers: response?.headers,
  });
}) satisfies UniversalHandler;
