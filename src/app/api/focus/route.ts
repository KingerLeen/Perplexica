import { randomUUID } from 'crypto';

const db = {
  focusModes: [
    {
      key: 'webSearch',
      title: 'All',
      description: 'Searches across all of the internet',
      icon: 'Globe',
    },
    {
      key: 'academicSearch',
      title: 'Academic',
      description: 'Search in published academic papers',
      icon: 'SwatchBook',
    },
    {
      key: 'writingAssistant',
      title: 'Writing',
      description: 'Chat without searching the web',
      icon: 'Pencil',
    },
    {
      key: 'wolframAlphaSearch',
      title: 'Wolfram Alpha',
      description: 'Computational knowledge engine',
      icon: 'BadgePercent',
    },
    {
      key: 'youtubeSearch',
      title: 'Youtube',
      description: 'Search and watch videos',
      icon: 'SiYoutube',
    },
    {
      key: 'redditSearch',
      title: 'Reddit',
      description: 'Search for discussions and opinions',
      icon: 'SiReddit',
    },
  ],
};

export const GET = async (req: Request) => {
  try {
    return Response.json(db.focusModes, { status: 200 });
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
      db.focusModes.push({ ...data, key: randomUUID() });
    } else if (type === 'update') {
      const index = db.focusModes.findIndex((item) => item.key === data.key);
      if (index !== -1) {
        db.focusModes[index] = data;
      } else {
        return Response.json(
          { message: 'Focus mode not found' },
          { status: 404 },
        );
      }
    } else if (type === 'delete') {
      const index = db.focusModes.findIndex((item) => item.key === data.key);
      if (index !== -1) {
        db.focusModes.splice(index, 1);
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
