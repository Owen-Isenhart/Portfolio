// this page so fire im so sad nobody will probably ever see it

import Link from 'next/link';
import Image from "next/image";
import Arrow from "../components/General/Arrow"
import NavBar from "../components/General/NavBar";
import Footer from "../components/General/Footer";

export default function NotFound() {
  return (
    <>
      <NavBar />
      <main className="relative flex-1 z-10">
        <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
          <div className="flex flex-col mx-auto max-w-3xl p-8 border-x border-dashed border-[var(--outline)]">
            <div className="w-full flex flex-row drop-shadow-accent drop-shadow-lg font-pirata justify-center items-center gap-2 text-9xl md:text-[20vw] lg:text-[15vw]">
              <h1>4</h1>
              <Image className="w-28 md:w-[20vw] lg:w-[15vw] rounded-full" src="/images/angryluther.png" alt="angry luther" width={1200} height={1200} />
              <h1>4</h1>
            </div>
            <div className="w-full flex flex-col justify-center items-center pt-3">
              <p className="font-sans text-sm md:text-xl lg:text-2xl">You're not supposed to be here. Luther is upset with you.</p>
              <p className="font-sans text-xs md:text-sm mb-4">(404 page not found)</p>

              <div className="group font-mono tracking-tight underline decoration-from-font underline-offset-2 pb-1 hover:cursor-pointer hover:decoration-[var(--accent)] hover:underline-offset-3 transition-all ease-in-out duration-300 flex flex-row items-start justify-center">
                <Link className="text-sm md:text-base pl-5" href="/">Return home </Link> <Arrow />
              </div>
            </div>
          </div>
        </section>
        <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
          <div className="flex flex-col mx-auto max-w-3xl p-8 border-x border-dashed border-[var(--outline)]">
            <p className="font-sans text-base md:text-lg">The page you were looking for does not exist :(</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

//       
