import dynamic from 'next/dynamic'

import NavBar from "../../components/General/NavBar";
import ProjectsIntro from "@/components/Projects/ProjectsIntro";
import OngoingProjects from "@/components/Projects/OngoingProject";
import PastProjects from "@/components/Projects/PastProject";
const Footer = dynamic(() => import("../../components/General/Footer"));


export default function Projects() {
  return (
    <>
      <NavBar />
      <main>
        <ProjectsIntro />
        <OngoingProjects />
        <PastProjects />
      </main>
      <Footer />
    </>
  );
}
