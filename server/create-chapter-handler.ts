import type { UniversalHandler } from "@universal-middleware/core";
import fetch from 'node-fetch';
import { FormData } from 'formdata-node';
import OpenAI from "openai";
import {
  buildOpenAIClient,
  delay,
  Hero,
  Heroes,
  CreateChapterRequestInput,
  UploadToCaptureInputParams,
  UploadToCaptureRequestInput,
  UploadToCaptureResult
} from "../common";

export const createChapterHandler = (async (request, context, runtime: any): Promise<Response> => {
  console.log('createChapterHandler');
  const env = runtime.env;
  const DB: KVNamespace = env.DB;

  if (await DB.get('_LOCKED')) {
    return new Response(JSON.stringify({ locked: true }), {
      status: 200,
      headers: {"content-type": "application/json"},
    });
  }
  await DB.put('_LOCKED', '1');

  const {hero, chapter} = await request.json() as CreateChapterRequestInput;
  const openaiClient = buildOpenAIClient(env);
  const selectedHero = Heroes[hero];

  const story = await generateStory(openaiClient, selectedHero, chapter);
  let basek = +(await DB.get('_LAST') || '0');
  try {
    for (const twoParagraphs of story) {
      const textToImageParagraph1 = await getParagraphToGenerateImage(openaiClient, twoParagraphs.text[0]);
      const textToImageParagraph2 = await getParagraphToGenerateImage(openaiClient, twoParagraphs.text[1]);

      basek++;
      await DB.put(`_TEMP_IMG1${basek}`, await generateImage(env, textToImageParagraph1));
      await DB.put(`_TEMP_IMG2${basek}`, await generateImage(env, textToImageParagraph2));
      await delay(1000);
      const backgroundImage = `data:image/png;base64,${await mergeBase64Images(env, basek)}`;

      const pageData = {
        init: basek,
        hero: selectedHero,
        chapter: chapter,
        textPage1: twoParagraphs.text[0],
        textPage2: twoParagraphs.text[1],
        pages: twoParagraphs.pages,
        status: 0,
        backgroundImage
      };
      await DB.put(`${basek}`, JSON.stringify(pageData));
    }

    await DB.put('_LAST', `${basek}`);
  } finally {
    await DB.delete('_LOCKED');
    for (let x = basek; x>basek-3; x--) {
      await DB.delete(`_TEMP_IMG1${x}`);
      await DB.delete(`_TEMP_IMG2${x}`);
    }
  }

  return new Response(JSON.stringify({ key: basek }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}) satisfies UniversalHandler;

export const uploadToCaptureHandler = (async (request, context, runtime: any): Promise<Response> => {
  console.log('uploadToCaptureHandler');
  const env = runtime.env;
  const DB: KVNamespace = env.DB;

  const { key, token } = await request.json() as UploadToCaptureRequestInput;
  let uploadResult: UploadToCaptureResult = {};
  for (let basek = +key-2; basek <= +key; basek++) {
    const pageData = JSON.parse(await DB.get(`${basek}`) || '{}');
    if (!pageData.status) {
      const response = await fetch(
        `${env.HTML_TO_IMG_RENDER_SERVICE}?width=1076&height=564&deviceScaleFactor=1&type=png&url=${env.SITE_BASE_URL}/render?key=${basek}`
      );
      const binaryImage = await response.arrayBuffer();
  
      uploadResult = await uploadFile(token, {
        chapter: pageData.chapter,
        hero: pageData.hero,
        pages: pageData.pages,
        binaryImage,
        key: basek
      });

      console.log(uploadResult);
      if (uploadResult.error) {
        break;
      }

      pageData.captureId = uploadResult.id;
      pageData.status = 1;
      await DB.put(`${basek}`, JSON.stringify(pageData));
    }
  }

  return new Response(JSON.stringify(uploadResult), {
    status: uploadResult.error ? 500 : 200,
    headers: {
      "content-type": "application/json",
    },
  });
}) satisfies UniversalHandler;


async function mergeBase64Images(env: Env, basek: number) {
  const response = await fetch(
    `${env.HTML_TO_IMG_RENDER_SERVICE}?width=1024&height=512&deviceScaleFactor=1&type=png&url=${env.SITE_BASE_URL}/render-merge-images?basek=${basek}`
  );
  const binaryImage = await response.arrayBuffer();
  const buf = Buffer.from(binaryImage);
  return buf.toString('base64');
}

async function generateImage(env: Env, input: string) {
  const response = await fetch(`${env.IMG_GENERATE_SERVICE}?q=${input.replaceAll('“', '"').replaceAll('”', '"')}`);
  const base64pngString = await response.text();
  return base64pngString;
}

async function generateStory(openaiClient: OpenAI, hero: Hero, chapter: string) {
  const message = `generate a small chapter of story (6 paragraphs) of a ${hero.kind} super hero "${hero.name}".
the name of the main character is "${hero.name}", don't create another name.
the chapter name is "${chapter}". don't include title`;

  const completion = await openaiClient.chat.completions.create({
    messages: [
      { role: "system", content: "You're a story writer." },
      { role: "user", content: message}
    ],
    model: "gpt-4o-mini",
  });

  const text = completion.choices[0].message.content + "\n";
  console.log(text);

  const story = [];
  let paragraph1 = '';
  let paragraph2 = '';
  let count = 0, isP2 = false;
  for (const line of text!.split("\n")) {
    if (line.trim().length) {
      if (!isP2) {
        paragraph1 += line.trim();
      } else {
        paragraph2 += line.trim();
      }
    } else if (!isP2) {
      isP2 = true;
    } else {
      count+=2;
      isP2 = false;
      story.push({
        pages: `${count-1},${count}`,
        text: [paragraph1, paragraph2]
      });
      paragraph1 = paragraph2 = '';
    }
  }

  console.log(story);
  return story;
}


async function getParagraphToGenerateImage(openaiClient: OpenAI, paragraph: string) {
  const message = `rewrite/simplify this paragraph by "removing the main character and descriptions"
and keeping only the other characters and the setting description:
"${paragraph}"`;

  const completion = await openaiClient.chat.completions.create({
    messages: [
      { role: "system", content: "You're a story writer." },
      { role: "user", content: message}
    ],
    model: "gpt-4o-mini",
  });

  const text = completion.choices[0].message.content;
  console.log(text);
  return text || '';
}

async function uploadFile(token: string, input: UploadToCaptureInputParams): Promise<UploadToCaptureResult> {
  const formData = new FormData();
  formData.append('asset_file', new Blob([Buffer.from(input.binaryImage)], { type: 'image/png' }), 'image.png');

  formData.append('meta', JSON.stringify({
    proof: {
      hash: '',
      mimeType: 'image/png',
      timestamp: ''
    },
    information: [{
      provider: 'Capture API',
      name: 'version',
      value: 'v3'
    }]
  }));

  formData.append('caption', `Infinity Book: Pet Heroes - ${input.hero.name} | ${input.chapter}`);
  formData.append('headline', `${input.hero.name} | ${input.chapter}`);
  formData.append('nit_commit_custom', JSON.stringify({
    captureEyeCustom: [
      {
        field: 'Hero',
        value: input.hero.name,
        url: `https://ipfs-pin.numbersprotocol.io/ipfs/${input.hero.cardNid}`
      },
      {
        field: 'Chapter',
        value: input.chapter
      },
      {
        field: 'Pages',
        value: input.pages,
      },
      {
        field: 'AI Model',
        value: 'FLUX.1-schnell',
      },
      {
        field: 'Text LLM Model',
        value: 'ChatGPT 4o mini',
      },
      {
        field: 'Site',
        value: 'Infinity Book: Pet Heroes',
        url: `https://infinity-book-pet-heroes.pages.dev`
      }
    ],
    customizedMetadata: {
      url: `https://infinity-book-pet-heroes.pages.dev/read?key=${input.key}`
    }
  }));
  console.log(formData);

  const response = await fetch('https://api.numbersprotocol.io/api/v3/assets/', {
    method: 'POST',
    headers: {
      'Authorization': `token ${token}`,
    },
    body: formData as any,
  });

  if (response.status == 201) {
    const jsonResponse = await response.json() as {id: string};
    return {
      id: jsonResponse.id,
      message: 'Success',
      error: false,
    };
  }

  return {
    message: await response.text(),
    error: true,
  };
}

export const renderMergeImagesHandler = (async (request, context, runtime: any): Promise<Response> => {
  console.log('renderMergeImagesHandler');
  const DB = runtime.env.DB;
  const basek = request.url.replace(/.*\?basek=/, '');
  const img1 = await DB.get(`_TEMP_IMG1${basek}`);
  const img2 = await DB.get(`_TEMP_IMG2${basek}`);

  return new Response(`
    <body style="margin: 0">
      <div style="display: flex;">
        <img src="data:image/png;base64,${img1}" />
        <img src="data:image/png;base64,${img2}" />
      </div>
    </body>
  `, {
    status: 200,
    headers: {"content-type": "text/HTML"},
  });
}) satisfies UniversalHandler;


export const keyHandler = (async (request, context, runtime: any): Promise<Response> => {
  console.log('keyHandler');
  const DB = runtime.env.DB;
  const key = request.url.replace(/.*\?key=/, '');
  const keyData = JSON.parse(await DB.get(key));

  return new Response(JSON.stringify(keyData), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}) satisfies UniversalHandler;
