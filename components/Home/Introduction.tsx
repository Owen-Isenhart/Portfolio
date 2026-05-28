import Arrow from "../General/Arrow";
import Image from "next/image"
import { Sparkle } from "lucide-react"

export default function Introduction() {
  const marqueeItems = [
    "Full Stack Engineering",
    "Cloud Architecture",
    "Game Development",
    "AI & Machine Learning",
    "Secure Development",
    "UI/UX Design",
    "APIs & Integration",
    "System Design",
  ];

  return (
    <>
      <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
          <div className="flex flex-row mx-auto max-w-3xl items-start p-6 border-x border-dashed border-[var(--outline)]">
            <div className="max-w-3xl w-full mx-auto flex flex-col items-start">
              <h2 className="font-space pb-2 text-xl sm:text-2xl md:text-3xl">Hey, I'm <span className="pirata-on-dark purple-glow"><span>O</span><span>w</span><span>e</span><span>n</span><span>!</span></span></h2>
              <p className="font-sans text-sm md:text-base pr-6 pb-2">I'm a passionate 20-year-old computer science student at UTD dedicated to building high-quality software. 
                <span className="hidden sm:inline"> In my free time, I'm typically working on projects, learning new things, playing games, or at the gym!</span>
              </p>
              <div className="group font-mono tracking-tight underline decoration-from-font underline-offset-2 pb-1 hover:cursor-pointer hover:decoration-[var(--accent)] hover:underline-offset-3 transition-all ease-in-out duration-300 flex flex-row">
                <a className="text-sm md:text-base" target="_blank" rel="noopener noreferrer" href="https://www.overleaf.com/read/hkpkfjvwsnfd#c11142">Resume </a> <Arrow />
              </div>
            </div>
            <div className="w-3/10 md:w-1/4 flex flex-col items-start">
              <Image className="w-full rounded-3xl" src="/images/headshot.avif" width={600} height={600} alt="Headshot" sizes="(max-width: 768px) 30vw, 25vw" priority fetchPriority="high" />
              <div className="fade overflow-hidden w-full whitespace-nowrap">
                <div className="inline-block animate-scroll-x">
                  <div className="font-sans text-xs text-light-foreground lg:text-sm lg:text-base inline-flex pt-1">
                    {[0, 1].map((copy) => (
                      <p key={copy} className="flex items-center gap-3" aria-hidden={copy === 1}>
                        {marqueeItems.map((item) => (
                          <span key={`${copy}-${item}`} className="flex items-center gap-3">
                            {item}
                            <Sparkle className="relative inline w-3" fill="var(--accent)" strokeWidth={0} />
                          </span>
                        ))}
                      </p>
                    ))}
                  </div>
                </div>
              </div>


            </div>
          </div>
        </section>
    </>
  );
}