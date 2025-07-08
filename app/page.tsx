import dynamic from 'next/dynamic'

import NavBar from "../components/General/NavBar";
import Introduction from "../components/Home/Introduction";
import Experience from "../components/Home/Experience";
import HomeProjects from "../components/Home/HomeProjects";
import HomeNotes from "../components/Home/HomeNotes";
const HomeLens = dynamic(() => import('../components/Home/HomeLens'))
const Footer = dynamic(() => import('../components/General/Footer'))
import { getNotes } from "../lib/notes";

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


export default async function Home() {
  const notes: Note[] = await getNotes(3);

  return (
    <>
      <NavBar />
      <main className="relative flex-1 z-10">
        <Introduction />
        <Experience />
        <HomeProjects />
        <HomeNotes notes={notes} />
        <HomeLens />
      </main>
      <Footer />
    </>
  );
}