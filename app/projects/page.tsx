import NavBar from "../../components/General/NavBar";
import ProjectsIntro from "@/components/Projects/ProjectsIntro";
import OngoingProjects from "@/components/Projects/OngoingProject";
import PastProjects from "@/components/Projects/PastProject";
import Footer from "../../components/General/Footer";


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
