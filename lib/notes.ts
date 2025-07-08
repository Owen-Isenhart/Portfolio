import { isFullPage } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

// The Note interface
interface Note {
  id: string;
  properties: {
    Title: { rich_text: [{ text: { content: string } }] };
    Author: { rich_text: [{ text: { content: string } }] };
    Date: { date: { start: string } };
    Tags: { multi_select: { name: string }[] };
    Slug: { rich_text: [{ text: { content: string } }] };
    ReadTime: { rich_text: [{ text: { content: string } }] };
  };
}

export async function getNotes(limit?: number): Promise<Note[]> {
  if (!DATABASE_ID) {
    throw new Error('Missing Notion database ID');
  }

  // We are using fetch to wrap the Notion API call for caching
  const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
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
      page_size: limit,
    }),
    next: { revalidate: 60 } // Revalidate every 60 seconds
  });

  if (!res.ok) {
    // Handle errors
    console.error(await res.json());
    return [];
  }

  const response: any = await res.json();

  const notes = response.results
    .filter((page: any): page is PageObjectResponse => isFullPage(page))
    .map((page: any) => {
      return page as unknown as Note;
    });

  return notes;
}