'use client';
import Link from "next/link";
import Arrow from "../General/Arrow";
import { Circle } from "lucide-react";

// The Note interface can be moved to a types file for better organization
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

interface HomeNotesProps {
    notes: Note[];
}

export default function HomeNotes({ notes }: HomeNotesProps) {
    return (
        <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
            <div className="max-w-3xl mx-auto flex flex-col items-start p-6 border-x border-dashed border-[var(--outline)]">
                <h2 className="font-space pb-2 text-xl sm:text-2xl md:text-3xl">Notes</h2>
                <div className="flex flex-col gap-1 w-full">
                    {notes.map(note => {
                        const slug = note.properties.Slug.rich_text[0].text.content;
                        const title = note.properties.Title.rich_text[0].text.content;
                        const author = note.properties.Author.rich_text[0].text.content;
                        const readTime = note.properties.ReadTime.rich_text[0].text.content;
                        const date = note.properties.Date.date.start;

                        if (!slug) return null;

                        return (
                            <Link className="group relative flex w-full overflow-hidden border border-transparent hover:border-dashed hover:border-outline hover:cursor-pointer" href={`/notes/${slug}`} key={note.id}>
                                <div className="flex w-full flex-col p-4 font-sans">
                                    <h2 className="text-lg font-semibold lg:text-xl">{title}</h2>
                                    <p className="text-sans pb-2 text-sm md:text-base text-light-foreground flex flex-row">
                                        {author} <Circle className="w-1 mx-2 -translate-y-[1px] fill-light-foreground" strokeWidth={0} /> {date ? `${new Date(date).toLocaleDateString()}` : ''} <Circle className="w-1 mx-2 -translate-y-[1px] fill-light-foreground" strokeWidth={0} /> {readTime ? `${readTime}` : ''}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {note.properties.Tags?.multi_select.map(tag => (
                                            <span key={tag.name} className="bg-light-background text-xs px-2 py-1 rounded-sm font-mono">
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                <Link href="/notes" className="group rounded-sm flex flex-row items-center justify-center gap-2 font-sans text-sm md:text-base mt-6 ml-4 px-4 py-1 bg-light-background border border-transparent border-dashed hover:border-[var(--outline)]">
                    See all
                    <div className="rotate-45 -translate-y-[1px]">
                        <Arrow />
                    </div>
                </Link>
            </div>
        </section>
    );
}