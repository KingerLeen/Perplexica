import prompts from '@/lib/prompts';
import { randomUUID } from 'crypto';

(global as any).db = {
  focusModes: [
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
  ],
};

export const GET = async (req: Request) => {
  try {
    return Response.json((global as any).db.focusModes, { status: 200 });
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
    if (type === 'create') {
      (global as any).db.focusModes.push({ ...data, key: randomUUID() });
    } else if (type === 'update') {
      const index = (global as any).db.focusModes.findIndex(
        (item: any) => item.key === data.key,
      );
      if (index !== -1) {
        (global as any).db.focusModes[index] = data;
      } else {
        return Response.json(
          { message: 'Focus mode not found' },
          { status: 404 },
        );
      }
    } else if (type === 'delete') {
      const index = (global as any).db.focusModes.findIndex(
        (item: any) => item.key === data.key,
      );
      if (index !== -1) {
        (global as any).db.focusModes.splice(index, 1);
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
