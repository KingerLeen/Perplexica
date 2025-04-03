import prompts from '@/lib/prompts';
import { randomUUID } from 'crypto';
import { getRedisClient } from '../redis';
import { loadModeHandlers } from '@/lib/search';

const redis = getRedisClient();

const _focusModes = [
  {
    key: 'webSearch',
    title: 'All',
    description: 'Searches across all of the internet',
    icon: 'Globe',
    agentConfig: {
      activeEngines: [],
      queryGeneratorPrompt: prompts.webSearchRetrieverPrompt,
      responsePrompt: prompts.webSearchResponsePrompt,
      rerank: true,
      rerankThreshold: 0.3,
      searchWeb: true,
      summarizer: true,
    },
  },
  {
    key: 'academicSearch',
    title: 'Academic',
    description: 'Search in published academic papers',
    icon: 'SwatchBook',
    agentConfig: {
      activeEngines: ['arxiv', 'google scholar', 'pubmed'],
      queryGeneratorPrompt: prompts.academicSearchRetrieverPrompt,
      responsePrompt: prompts.academicSearchResponsePrompt,
      rerank: true,
      rerankThreshold: 0,
      searchWeb: true,
      summarizer: false,
    },
  },
  {
    key: 'writingAssistant',
    title: 'Writing',
    description: 'Chat without searching the web',
    icon: 'Pencil',
    agentConfig: {
      activeEngines: [],
      queryGeneratorPrompt: '',
      responsePrompt: prompts.writingAssistantPrompt,
      rerank: true,
      rerankThreshold: 0,
      searchWeb: false,
      summarizer: false,
    },
  },
  {
    key: 'wolframAlphaSearch',
    title: 'Wolfram Alpha',
    description: 'Computational knowledge engine',
    icon: 'BadgePercent',
    agentConfig: {
      activeEngines: ['wolframalpha'],
      queryGeneratorPrompt: prompts.wolframAlphaSearchRetrieverPrompt,
      responsePrompt: prompts.wolframAlphaSearchResponsePrompt,
      rerank: false,
      rerankThreshold: 0,
      searchWeb: true,
      summarizer: false,
    },
  },
  {
    key: 'youtubeSearch',
    title: 'Youtube',
    description: 'Search and watch videos',
    icon: 'SiYoutube',
    agentConfig: {
      activeEngines: ['youtube'],
      queryGeneratorPrompt: prompts.youtubeSearchRetrieverPrompt,
      responsePrompt: prompts.youtubeSearchResponsePrompt,
      rerank: true,
      rerankThreshold: 0.3,
      searchWeb: true,
      summarizer: false,
    },
  },
  {
    key: 'redditSearch',
    title: 'Reddit',
    description: 'Search for discussions and opinions',
    icon: 'SiReddit',
    agentConfig: {
      activeEngines: ['reddit'],
      queryGeneratorPrompt: prompts.redditSearchRetrieverPrompt,
      responsePrompt: prompts.redditSearchResponsePrompt,
      rerank: true,
      rerankThreshold: 0.3,
      searchWeb: true,
      summarizer: false,
    },
  },
];

const setFocusModes = async (data: any) => {
  redis.set('focusModes', JSON.stringify(data)).finally(() => {
    loadModeHandlers();
  });
};
setFocusModes(_focusModes);

export const getFocusModes = async () => {
  let focusModes: any[] = [];
  try {
    const focusModesString = await redis.get('focusModes');
    if (focusModesString) {
      focusModes = JSON.parse(focusModesString);
    }
  } catch (err) {
    console.error('An error occurred while setting config:', err);
  }
  return focusModes;
};

export const GET = async (req: Request) => {
  const focusModes = await getFocusModes();

  try {
    return Response.json(focusModes, { status: 200 });
  } catch (err) {
    console.error('An error occurred while getting config:', err);
    return Response.json(
      { message: 'An error occurred while getting config' },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const { data, type } = await req.json();

    const focusModes = await getFocusModes();

    if (type === 'create') {
      focusModes.push({ ...data, key: randomUUID() });
      await redis.set('focusModes', JSON.stringify(focusModes));
    } else if (type === 'update') {
      const index = focusModes.findIndex((item: any) => item.key === data.key);
      if (index !== -1) {
        focusModes[index] = data;
        await setFocusModes(focusModes);
      } else {
        return Response.json(
          { message: 'Focus mode not found' },
          { status: 404 },
        );
      }
    } else if (type === 'delete') {
      const index = focusModes.findIndex((item: any) => item.key === data.key);
      if (index !== -1) {
        focusModes.splice(index, 1);
        await setFocusModes(focusModes);
      }
    }

    return Response.json({ message: 'Config updated' }, { status: 200 });
  } catch (err) {
    console.error('An error occurred while updating config:', err);
    return Response.json(
      { message: 'An error occurred while updating config' },
      { status: 500 },
    );
  }
};
