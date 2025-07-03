import NavBar from "../components/NavBar";
import Introduction from "../components/Introduction"
import Experience from "../components/Experience";
import HomeProjects from "../components/HomeProjects";
import HomeNotes from "../components/HomeNotes";
import HomeLens from "../components/HomeLens";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="relative flex-1 z-10">
        <Introduction />
        <Experience />
        <HomeProjects />
        <HomeNotes />
        <HomeLens />
      </main>
      <Footer />
    </>
  );
}
