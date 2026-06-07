import dynamic from 'next/dynamic'

import NavBar from "../components/General/NavBar";
import Introduction from "../components/Home/Introduction";
import Experience from "../components/Home/Experience";
import HomeProjects from "../components/Home/HomeProjects";
import HomeLens from "../components/Home/HomeLens";
const HomeNotes = dynamic(() => import("../components/Home/HomeNotes"));
const Footer = dynamic(() => import('../components/General/Footer'))
import { getNotes } from "../lib/notes";
import type { NoteSummary } from "../lib/notes";


export default async function Home() {
  const notes: NoteSummary[] = await getNotes(3);

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