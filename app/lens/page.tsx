import NavBar from "../../components/General/NavBar";
import LensIntro from "../../components/Lens/LensIntro";
import LensPics from "../../components/Lens/LensPics";

import Footer from "../../components/General/Footer";

export default function Lens() {
  return (
    <>
      <NavBar />
      <main className="relative flex-1 z-10">
        <LensIntro />
        <LensPics />
      </main>
      <Footer />
    </>
  );
}
