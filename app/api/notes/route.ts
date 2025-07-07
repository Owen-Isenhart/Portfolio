import { Client } from '@notionhq/client';
import { NextRequest } from 'next/server';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function GET(request: NextRequest) {
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error('Missing Notion database ID');
  }

  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get('limit');
  
  const databaseId = process.env.NOTION_DATABASE_ID;

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
      page_size: limit ? parseInt(limit) : undefined,
    });
    console.log(response.results);
    return new Response(JSON.stringify(response.results));
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch notes' }), {
      status: 500,
    });
  }
}