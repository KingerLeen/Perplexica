'use client';

import { Settings as SettingsIcon, ArrowLeft, Loader2 } from 'lucide-react';
import { createContext, use, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  BadgePercent,
  ChevronDown,
  Globe,
  Pencil,
  ScanEye,
  SwatchBook,
} from 'lucide-react';
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from '@headlessui/react';
import { SiReddit, SiYoutube } from '@icons-pack/react-simple-icons';
import { Fragment } from 'react';
import { Form, FormOptions } from './Form';

type FocusMode = Array<{
  key: string;
  title: string;
  description: string;
  icon: string;
  agentConfig: {
    queryGeneratorPrompt: string;
    responsePrompt: string;
    searchWeb: boolean;
    rerank: boolean;
    rerankThreshold: number;
    activeEngines: Array<string>;
    summarizer: boolean;
  };
}>;

const Icons: {
  [key: string]: JSX.Element;
} = {
  Globe: <Globe size={20} />,
  SwatchBook: <SwatchBook size={20} />,
  Pencil: <Pencil size={16} />,
  BadgePercent: <BadgePercent size={20} />,
  SiYoutube: <SiYoutube className="h-5 w-auto mr-0.5" />,
  SiReddit: <SiReddit className="h-5 w-auto mr-0.5" />,
};

const options: FormOptions = [
  {
    label: 'Title',
    name: 'title',
    type: 'input',
    required: true,
    maxLength: 64,
    requiredMessage: 'Title is required',
    maxLengthMessage: 'Title is too long',
    placeholder: 'Enter title',
  },
  {
    label: 'Description',
    name: 'description',
    type: 'textarea',
    maxLength: 256,
    requiredMessage: 'Description is required',
    maxLengthMessage: 'Description is too long',
    placeholder: 'Enter description',
  },
  {
    label: 'Icon',
    name: 'icon',
    type: 'select',
    options: Object.keys(Icons).map((key) => ({
      label: key,
      value: key,
    })),
    required: true,
    requiredMessage: 'Icon is required',
    placeholder: 'Select icon',
  },
  {
    label: 'Search Web',
    name: 'searchWeb',
    type: 'switch',
    required: true,
    requiredMessage: 'Search Web is required',
  },
  {
    label: 'summarizer',
    name: 'summarizer',
    type: 'switch',
    required: true,
    requiredMessage: 'summarizer is required',
  },
  {
    label: 'rerank',
    name: 'rerank',
    type: 'switch',
    required: true,
    requiredMessage: 'rerank is required',
  },
  {
    label: 'rerankThreshold',
    name: 'rerankThreshold',
    type: 'number',
    required: true,
    requiredMessage: 'rerankThreshold is required',
    placeholder: 'rerankThreshold',
  },
  {
    label: 'queryGeneratorPrompt',
    name: 'queryGeneratorPrompt',
    type: 'textarea',
    maxLength: 10240,
    requiredMessage: 'queryGeneratorPrompt is required',
    maxLengthMessage: 'queryGeneratorPrompt is too long',
    placeholder: 'Enter queryGeneratorPrompt',
  },
  {
    label: 'responsePrompt',
    name: 'responsePrompt',
    type: 'textarea',
    maxLength: 10240,
    requiredMessage: 'responsePrompt is required',
    maxLengthMessage: 'responsePrompt is too long',
    placeholder: 'Enter responsePrompt',
  },
  {
    label: 'activeEngines',
    name: 'activeEngines',
    type: 'checkbox',
    options: [
      { label: 'youtube', value: 'youtube' },
      { label: 'arxiv', value: 'arxiv' },
      { label: 'pubmed', value: 'pubmed' },
      { label: 'google scholar', value: 'google scholar' },
      { label: 'wolframalpha', value: 'wolframalpha' },
      { label: 'reddit', value: 'reddit' },
    ],
  },
];

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [focusModes, setFocusModes] = useState<FocusMode>([]);

  const loadFocusModes = async () => {
    setLoading(true);
    const response = await fetch('/api/focus', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setFocusModes(data);
    setLoading(false);
  };

  console.log(focusModes);

  useEffect(() => {
    loadFocusModes();
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between mt-4">
          <Popover className="max-w-[15rem] md:max-w-md lg:max-w-lg">
            <PopoverButton
              type="button"
              className="flex flex-row items-center justify-between space-x-1 p-1 text-black/50 dark:text-white/50 rounded-xl hover:bg-light-secondary dark:hover:bg-dark-secondary active:scale-95 transition duration-200 hover:text-black dark:hover:text-white"
            >
              add new Focus
            </PopoverButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-150"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <PopoverPanel className="absolute top-[8%] left-[25%] w-[50%] ">
                <div className="p-4 bg-light-primary dark:bg-dark-primary border rounded-md border-light-200 dark:border-dark-200 w-full max-h-[200px] md:max-h-none overflow-y-auto flex flex-col gap-4">
                  <Form
                    initValues={{
                      icon: 'Globe',
                      title: '',
                      description: '',

                      searchWeb: false,
                      rerank: false,
                      rerankThreshold: 0,
                      summarizer: false,
                      queryGeneratorPrompt: '',
                      responsePrompt: '',
                      activeEngines: [],
                    }}
                    options={options}
                    onSubmit={(values) => {
                      console.log(values);
                      fetch('/api/focus', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          data: {
                            title: values.title,
                            description: values.description,
                            icon: values.icon,
                            agentConfig: {
                              queryGeneratorPrompt: values.queryGeneratorPrompt,
                              responsePrompt: values.responsePrompt,
                              searchWeb: values.searchWeb,
                              rerank: values.rerank,
                              rerankThreshold: values.rerankThreshold,
                              activeEngines: values.activeEngines,
                              summarizer: values.summarizer,
                            },
                          },
                          type: 'create',
                        }),
                      })
                        .then((res) => res.json())
                        .then(() => {
                          loadFocusModes();
                        });
                    }}
                  />
                </div>
              </PopoverPanel>
            </Transition>
          </Popover>
        </div>
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          focusModes.map((mode) => (
            <div key={mode.key} className="">
              <div className={cn('flex flex-row items-center space-x-1')}>
                {Icons[mode.icon]}
                <p className="text-sm font-medium">{mode.title}</p>

                <Popover className="max-w-[15rem] md:max-w-md lg:max-w-lg">
                  <PopoverButton
                    type="button"
                    className="flex flex-row items-center justify-between space-x-1 p-1 text-black/50 dark:text-white/50 rounded-xl hover:bg-light-secondary dark:hover:bg-dark-secondary active:scale-95 transition duration-200 hover:text-black dark:hover:text-white"
                  >
                    edit
                  </PopoverButton>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-150"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <PopoverPanel className="absolute top-[8%] left-[25%] w-[50%] ">
                      <div className="p-4 bg-light-primary dark:bg-dark-primary border rounded-md border-light-200 dark:border-dark-200 w-full max-h-[200px] md:max-h-none overflow-y-auto flex flex-col gap-4">
                        <Form
                          initValues={{
                            icon: mode.icon,
                            title: mode.title,
                            description: mode.description,

                            queryGeneratorPrompt:
                              mode.agentConfig.queryGeneratorPrompt,
                            responsePrompt: mode.agentConfig.responsePrompt,
                            searchWeb: mode.agentConfig.searchWeb,
                            rerank: mode.agentConfig.rerank,
                            rerankThreshold: mode.agentConfig.rerankThreshold,
                            activeEngines: mode.agentConfig.activeEngines,
                            summarizer: mode.agentConfig.summarizer,
                          }}
                          options={options}
                          onSubmit={(values) => {
                            console.log(values);
                            fetch('/api/focus', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                data: {
                                  key: mode.key,

                                  title: values.title,
                                  description: values.description,
                                  icon: values.icon,
                                  agentConfig: {
                                    queryGeneratorPrompt:
                                      values.queryGeneratorPrompt,
                                    responsePrompt: values.responsePrompt,
                                    searchWeb: values.searchWeb,
                                    rerank: values.rerank,
                                    rerankThreshold: values.rerankThreshold,
                                    activeEngines: values.activeEngines,
                                    summarizer: values.summarizer,
                                  },
                                },
                                type: 'update',
                              }),
                            })
                              .then((res) => res.json())
                              .then(() => {
                                loadFocusModes();
                              });
                          }}
                        />
                      </div>
                    </PopoverPanel>
                  </Transition>
                </Popover>

                <Popover className="max-w-[15rem] md:max-w-md lg:max-w-lg">
                  <PopoverButton
                    type="button"
                    className="flex flex-row items-center justify-between space-x-1 p-1 text-red-500 rounded-xl hover:bg-light-secondary dark:hover:bg-dark-secondary active:scale-95 transition duration-200 hover:text-black dark:hover:text-red-400"
                  >
                    delete
                  </PopoverButton>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-150"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <PopoverPanel className="absolute top-[20%] left-[25%] w-[50%] ">
                      <div className="p-4 bg-light-primary dark:bg-dark-primary border rounded-md border-light-200 dark:border-dark-200 w-full max-h-[200px] md:max-h-none overflow-y-auto flex flex-col gap-4">
                        <p className="text-sm font-medium">
                          Are you sure you want to delete this focus mode?
                        </p>
                        <div
                          onClick={() => {
                            fetch('/api/focus', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                data: { ...mode },
                                type: 'delete',
                              }),
                            })
                              .then((res) => res.json())
                              .then(() => {
                                loadFocusModes();
                              });
                          }}
                          className="flex flex-row items-center justify-between space-x-1 p-1 text-red-500 dark:text-red/50 rounded-xl hover:bg-light-secondary dark:hover:bg-dark-secondary active:scale-95 transition duration-200 hover:text-black dark:hover:text-red-400"
                        >
                          <button type="button">Delete</button>
                        </div>
                      </div>
                    </PopoverPanel>
                  </Transition>
                </Popover>
              </div>
              <p className="text-black/70 dark:text-white/70 text-xs ml-6">
                {mode.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Page;
