import MetaSearchAgent from '@/lib/search/metaSearchAgent';
import prompts from '../prompts';
import { getFocusModes } from '@/app/api/focus/route';

export const createSearchHandlers = ({
  activeEngines = [],
  queryGeneratorPrompt = '',
  responsePrompt = '',
  rerank = true,
  rerankThreshold = 0.3,
  searchWeb = true,
  summarizer = true,
}) => {
  return new MetaSearchAgent({
    activeEngines,
    queryGeneratorPrompt,
    responsePrompt,
    rerank,
    rerankThreshold,
    searchWeb,
    summarizer,
  });
};

// export const searchHandlers: Record<string, MetaSearchAgent> = {
//   webSearch: new MetaSearchAgent({
//     activeEngines: [],
//     queryGeneratorPrompt: prompts.webSearchRetrieverPrompt,
//     responsePrompt: prompts.webSearchResponsePrompt,
//     rerank: true,
//     rerankThreshold: 0.3,
//     searchWeb: true,
//     summarizer: true,
//   }),
//   academicSearch: new MetaSearchAgent({
//     activeEngines: ['arxiv', 'google scholar', 'pubmed'],
//     queryGeneratorPrompt: prompts.academicSearchRetrieverPrompt,
//     responsePrompt: prompts.academicSearchResponsePrompt,
//     rerank: true,
//     rerankThreshold: 0,
//     searchWeb: true,
//     summarizer: false,
//   }),
//   writingAssistant: new MetaSearchAgent({
//     activeEngines: [],
//     queryGeneratorPrompt: '',
//     responsePrompt: prompts.writingAssistantPrompt,
//     rerank: true,
//     rerankThreshold: 0,
//     searchWeb: false,
//     summarizer: false,
//   }),
//   wolframAlphaSearch: new MetaSearchAgent({
//     activeEngines: ['wolframalpha'],
//     queryGeneratorPrompt: prompts.wolframAlphaSearchRetrieverPrompt,
//     responsePrompt: prompts.wolframAlphaSearchResponsePrompt,
//     rerank: false,
//     rerankThreshold: 0,
//     searchWeb: true,
//     summarizer: false,
//   }),
//   youtubeSearch: new MetaSearchAgent({
//     activeEngines: ['youtube'],
//     queryGeneratorPrompt: prompts.youtubeSearchRetrieverPrompt,
//     responsePrompt: prompts.youtubeSearchResponsePrompt,
//     rerank: true,
//     rerankThreshold: 0.3,
//     searchWeb: true,
//     summarizer: false,
//   }),
//   redditSearch: new MetaSearchAgent({
//     activeEngines: ['reddit'],
//     queryGeneratorPrompt: prompts.redditSearchRetrieverPrompt,
//     responsePrompt: prompts.redditSearchResponsePrompt,
//     rerank: true,
//     rerankThreshold: 0.3,
//     searchWeb: true,
//     summarizer: false,
//   }),
// };

export const searchHandlers: Record<string, MetaSearchAgent> = {};

export const loadModeHandlers = async () => {
  const focusModes = await getFocusModes();
  for (let i = 0; i < focusModes.length; i++) {
    const mode = focusModes[i];
    const config = mode.agentConfig;
    if (!config) {
      console.error(`No agentConfig found for focus mode ${mode.key}`);
      continue;
    }
    console.log(`Loading search handler for focus mode ${mode.key}`);
    console.log(config);
    searchHandlers[mode.key] = new MetaSearchAgent(config);
  }
};
