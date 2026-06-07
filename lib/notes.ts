import { promises as fs } from 'fs';
import path from 'path';

const NOTES_DIRECTORY = path.join(process.cwd(), 'content', 'notes');

export interface NoteFrontmatter {
  title: string;
  author: string;
  date: string;
  tags: string[];
  readTime: string;
  coverImage?: string;
  draft?: boolean;
}

export interface NoteSummary extends NoteFrontmatter {
  id: string;
  slug: string;
}

export interface NoteDetail extends NoteSummary {
  content: string;
}

function parseFrontmatterValue(value: string): string | string[] | boolean {
  const trimmed = value.trim();

  if (trimmed === 'true' || trimmed === 'false') {
    return trimmed === 'true';
  }

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const inner = trimmed.slice(1, -1).trim();

    if (!inner) {
      return [];
    }

    return inner.split(',').map(item => item.trim().replace(/^['"]|['"]$/g, ''));
  }

  return trimmed.replace(/^['"]|['"]$/g, '');
}

function parseMarkdownFile(fileContents: string) {
  const match = fileContents.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    throw new Error('Invalid note markdown file. Missing frontmatter.');
  }

  const frontmatterLines = match[1].split(/\r?\n/).filter(Boolean);
  const content = match[2].trimStart();
  const frontmatter: Record<string, string | string[] | boolean> = {};

  for (const line of frontmatterLines) {
    const separatorIndex = line.indexOf(':');

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1);
    frontmatter[key] = parseFrontmatterValue(rawValue);
  }

  return { frontmatter, content };
}

function toSummary(slug: string, frontmatter: Record<string, string | string[] | boolean>): NoteSummary {
  const title = frontmatter.title;
  const author = frontmatter.author;
  const date = frontmatter.date;
  const tags = frontmatter.tags;
  const readTime = frontmatter.readTime;
  const coverImage = frontmatter.coverImage;
  const draft = frontmatter.draft;

  if (typeof title !== 'string' || typeof author !== 'string' || typeof date !== 'string' || typeof readTime !== 'string' || !Array.isArray(tags)) {
    throw new Error(`Invalid frontmatter for note "${slug}".`);
  }

  return {
    id: slug,
    slug,
    title,
    author,
    date,
    tags: tags.filter((tag): tag is string => typeof tag === 'string'),
    readTime,
    ...(typeof coverImage === 'string' && coverImage ? { coverImage } : {}),
    ...(typeof draft === 'boolean' ? { draft } : {}),
  };
}

async function readNoteFile(filePath: string): Promise<NoteDetail> {
  const slug = path.basename(filePath, path.extname(filePath));
  const fileContents = await fs.readFile(filePath, 'utf8');
  const { frontmatter, content } = parseMarkdownFile(fileContents);
  const summary = toSummary(slug, frontmatter);

  return {
    ...summary,
    content,
  };
}

async function readAllNotes(): Promise<NoteDetail[]> {
  const entries = await fs.readdir(NOTES_DIRECTORY, { withFileTypes: true });
  const noteFiles = entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
    .map(entry => path.join(NOTES_DIRECTORY, entry.name));

  const notes = await Promise.all(noteFiles.map(readNoteFile));

  return notes.filter(note => !note.draft).sort((left, right) => {
    return new Date(right.date).getTime() - new Date(left.date).getTime();
  });
}

export async function getNotes(limit?: number): Promise<NoteSummary[]> {
  const notes = await readAllNotes();

  return typeof limit === 'number' ? notes.slice(0, limit) : notes;
}

export async function getNoteBySlug(slug: string): Promise<NoteDetail | null> {
  try {
    const note = await readNoteFile(path.join(NOTES_DIRECTORY, `${slug}.md`));
    if (note.draft) {
      return null;
    }
    return note;
  } catch {
    return null;
  }
}

export async function getNoteSlugs(): Promise<string[]> {
  const notes = await readAllNotes();

  return notes.map(note => note.slug);
}