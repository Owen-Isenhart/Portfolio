import dynamic from "next/dynamic"
import Image from "next/image";
import NavBar from '../../../components/General/NavBar';
const Footer = dynamic(() => import('../../../components/General/Footer'));
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { isFullPage } from '@notionhq/client';
import { notFound } from 'next/navigation';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

async function getNoteData(slug: string) {
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error('Missing Notion Database ID');
  }

  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: 'Slug',
      rich_text: {
        equals: slug,
      },
    },
  });

  const page = response.results[0];
  if (!page || !isFullPage(page)) return null;

  const mdblocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdblocks);

  const imageProperty = page.properties['Image'] as any;
  let imageUrl: string | null = null;
  if (imageProperty?.files?.length > 0) {
    const file = imageProperty.files[0];
    imageUrl = file.type === 'external' ? file.external.url : file.file.url;
  }

  return {
    properties: page.properties,
    markdown: mdString.parent,
    imageUrl,
  };
}

function parseCustomMarkdown(input: string): React.ReactNode[] {
  const lines = input.split('\n');
  const elements: React.ReactNode[] = [];

  for (const [index, line] of lines.entries()) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('## ')) {
      elements.push(<h2 className="font-space font-semibold pb-1 text-lg sm:text-xl md:text-2xl" key={index}>{trimmed.slice(3).trim()}</h2>);
    } else if (trimmed.startsWith('### ')) {
      elements.push(<h3 className="font-space font-medium pb-1 text-base sm:text-lg md:text-xl" key={index}>{trimmed.slice(4).trim()}</h3>);
    } else {
      elements.push(<p className="pb-5 text-sm sm:text-base md:text-lg" key={index}>{trimmed.trim()}</p>);
    }
  }

  return elements;
}

export default async function NotePage({ params }: { params: { slug: string } }) {
  const note = await getNoteData(params.slug);

  if (!note) {
    return notFound();
  }

  const title = (note.properties.Title as any)?.rich_text?.[0]?.text?.content ?? 'Untitled';
  const author = (note.properties.Author as any)?.rich_text?.[0]?.text?.content ?? 'Unknown Author';
  const date = (note.properties.Date as any)?.date?.start;
  const tags = (note.properties.Tags as any)?.multi_select ?? [];
  const imageUrl = note.imageUrl;

  return (
    <>
      <NavBar />
      <main>
        <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
          <article className="max-w-3xl mx-auto flex flex-col items-start p-6 border-x border-dashed border-[var(--outline)] text-foreground font-sans">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={title}
                className="mb-4 w-full h-auto"
                width={1200}
                height={630}
                priority
              />
            )}
            <h1 className="font-space pb-1 text-xl sm:text-2xl md:text-3xl">{title}</h1>
            <p className="text-sm text-light-foreground">
              By {author} {date ? `on ${new Date(date).toLocaleDateString()}` : ''}
            </p>
            <div className="flex flex-wrap gap-2 mt-3 mb-5">
              {tags.map((tag: { name: string }) => (
                <span key={tag.name} className="bg-light-background text-xs px-2 py-1 rounded-sm font-mono no-underline">
                  {tag.name}
                </span>
              ))}
            </div>

            {parseCustomMarkdown(note.markdown)}
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
}