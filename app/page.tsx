import NavBar from "../components/General/NavBar";
import Introduction from "../components/Home/Introduction"
import Experience from "../components/Home/Experience";
import HomeProjects from "../components/Home/HomeProjects";
import HomeNotes from "../components/Home/HomeNotes";
import HomeLens from "../components/Home/HomeLens";
import Footer from "../components/General/Footer";

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
