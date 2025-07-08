'use client';

import { useState, useEffect } from 'react';
import NavBar from '../../components/General/NavBar';
import Footer from '../../components/General/Footer';
import Link from 'next/link';
import { Circle } from 'lucide-react';

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

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const res = await fetch('/api');
      const data: Note[] = await res.json();
      setNotes(data);

      const allTags = data.flatMap((note: Note) =>
        note.properties.Tags.multi_select.map(tag => tag.name)
      );
      setTags([...new Set(allTags)]);
    };
    fetchNotes();
  }, []);

  const filteredNotes = selectedTag
    ? notes.filter(note =>
      note.properties.Tags.multi_select.some(tag => tag.name === selectedTag)
    )
    : notes;

  return (
    <>
      <NavBar />
      <main>
        <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
          <div className="max-w-3xl mx-auto flex flex-col items-start p-6 border-x border-dashed border-[var(--outline)]">
            <h1 className="font-space pb-4 text-xl sm:text-2xl md:text-3xl">Notes</h1>
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 rounded-sm text-sm border hover:cursor-pointer ${selectedTag === null
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                    : 'bg-transparent border-dashed border-[var(--outline)] hover:bg-light-background hover:border-solid'
                  }`}
              >
                All
              </button>
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-sm text-sm border hover:cursor-pointer ${selectedTag === tag
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : 'bg-transparent border-dashed border-[var(--outline)] hover:bg-light-background hover:border-solid'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1 w-full">
              {filteredNotes.map(note => (
                <Link className="group relative flex w-full overflow-hidden border border-transparent hover:border-dashed hover:border-outline hover:cursor-pointer" href={`/notes/${note.properties.Slug.rich_text[0].text.content}`} key={note.id}>
                  <div className="flex w-full flex-col p-4 font-sans">
                    <h2 className="text-lg font-semibold lg:text-xl">{note.properties.Title.rich_text[0].text.content}</h2>
                    <p className="text-sans pb-2 text-sm md:text-base text-light-foreground flex flex-row">
                      {note.properties.Author.rich_text[0].text.content} <Circle className="w-1 mx-2 -translate-y-[1px] fill-light-foreground" strokeWidth={0} /> {new Date(note.properties.Date.date.start).toLocaleDateString()} <Circle className="w-1 mx-2 -translate-y-[1px] fill-light-foreground" strokeWidth={0} /> {note.properties.ReadTime.rich_text[0].text.content}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {note.properties.Tags.multi_select.map(tag => (
                        <span key={tag.name} className="bg-light-background text-xs px-2 py-1 rounded-sm font-mono">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}