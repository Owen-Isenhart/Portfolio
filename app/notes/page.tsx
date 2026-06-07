import { getNotes } from '../../lib/notes';
import NavBar from '../../components/General/NavBar';
import Footer from '../../components/General/Footer';
import Link from 'next/link';
import { Circle } from 'lucide-react';
import type { NoteSummary } from '../../lib/notes';

export default async function Notes() {
  const notes: NoteSummary[] = await getNotes();

  return (
    <>
      <NavBar />
      <main>
        <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
          <div className="max-w-3xl mx-auto flex flex-col items-start p-6 border-x border-dashed border-[var(--outline)]">
            <h1 className="font-space pb-4 text-xl sm:text-2xl md:text-3xl">Notes</h1>
            <div className="flex flex-col gap-1 w-full">
              {notes.map(note => (
                <Link className="group relative flex w-full overflow-hidden border border-transparent hover:border-dashed hover:border-outline hover:cursor-pointer" href={`/notes/${note.slug}`} key={note.id}>
                  <div className="flex w-full flex-col p-4 font-sans">
                    <h2 className="text-lg font-semibold lg:text-xl">{note.title}</h2>
                    <p className="text-sans pb-2 text-sm md:text-base text-light-foreground flex flex-row">
                      {note.author} <Circle className="w-1 mx-2 -translate-y-[1px] fill-light-foreground" strokeWidth={0} /> {new Date(note.date).toLocaleDateString()} <Circle className="w-1 mx-2 -translate-y-[1px] fill-light-foreground" strokeWidth={0} /> {note.readTime}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map(tag => (
                        <span key={tag} className="bg-light-background text-xs px-2 py-1 rounded-sm font-mono">
                          {tag}
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