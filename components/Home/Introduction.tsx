import Arrow from "../General/Arrow";
import Image from "next/image"
import { Sparkle } from "lucide-react"

export default function Introduction() {
  return (
    <>
      <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
          <div className="flex flex-row mx-auto max-w-3xl items-start p-6 border-x border-dashed border-[var(--outline)]">
            <div className="max-w-3xl w-full mx-auto flex flex-col items-start">
              <h2 className="font-space pb-2 text-xl sm:text-2xl md:text-3xl">Hey, I'm <span className="pirata-on-dark purple-glow"><span>O</span><span>w</span><span>e</span><span>n</span><span>!</span></span></h2>
              <p className="font-sans text-sm md:text-base pr-6 pb-2">I'm a passionate 19-year-old computer science student at UTD dedicated to building high-quality software. 
                <span className="hidden sm:inline"> In my free time, I'm typically working on projects, learning new things, playing games, or at the gym!</span>
              </p>
              <div className="group font-mono tracking-tight underline decoration-from-font underline-offset-2 pb-1 hover:cursor-pointer hover:decoration-[var(--accent)] hover:underline-offset-3 transition-all ease-in-out duration-300 flex flex-row">
                <a className="text-sm md:text-base" href="/resume.pdf" download="Owen-Isenhart-Resume.pdf">Download Resume </a> <Arrow />
              </div>
            </div>
            <div className="w-3/10 md:w-1/4 flex flex-col items-start">
              <Image className="w-full rounded-3xl" src="/images/oxef.jpg" width={600} height={600} alt="Headshot" />
              <div className="fade overflow-hidden w-full whitespace-nowrap">
                <div className="inline-block animate-scroll-x">
                  <div className="font-sans text-xs text-light-foreground lg:text-sm lg:text-base inline-flex pt-1">
                    <p className="flex items-center gap-3">
                      Full Stack Engineering <Sparkle className="relative inline w-3" fill="var(--accent)" strokeWidth={0} />
                      Cloud Architecture <Sparkle className="relative inline w-3" fill="var(--accent)" strokeWidth={0} />
                      Game Development <Sparkle className="relative inline w-3" fill="var(--accent)" strokeWidth={0} />
                      AI & Machine Learning <Sparkle className="relative inline w-3" fill="var(--accent)" strokeWidth={0} />
                      Secure Development <Sparkle className="relative inline w-3" fill="var(--accent)" strokeWidth={0} />
                      UI/UX Design <Sparkle className="relative inline w-3" fill="var(--accent)" strokeWidth={0} />
                      APIs & Integration <Sparkle className="relative inline w-3" fill="var(--accent)" strokeWidth={0} />
                      System Design <Sparkle className="relative inline w-3" fill="var(--accent)" strokeWidth={0} />&nbsp;
                    </p>
                    <p className="flex items-center gap-3">
                      Full Stack Engineering <Sparkle className="relative inline w-3" fill="var(--accent)" strokeWidth={0} />
                      Cloud Architecture <Sparkle className="relative inline w-3" fill="var(--accent)" strokeWidth={0} />
                      Game Development <Sparkle className="relative inline w-3" fill="var(--accent)" strokeWidth={0} />
                      AI & Machine Learning <Sparkle className="relative inline w-3" fill="var(--accent)" strokeWidth={0} />
                      Secure Development <Sparkle className="relative inline w-3" fill="var(--accent)" strokeWidth={0} />
                      UI/UX Design <Sparkle className="relative inline w-3" fill="var(--accent)" strokeWidth={0} />
                      API Design & Integration <Sparkle className="relative inline w-3" fill="var(--accent)" strokeWidth={0} />
                      Software Architecture <Sparkle className="relative inline w-3" fill="var(--accent)" strokeWidth={0} />&nbsp;
                    </p>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </section>
    </>
  );
}