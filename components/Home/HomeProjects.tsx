import ProjectSlider from "./ProjectSlider";
import Link from "next/link";
import Arrow from "../General/Arrow";

const projects = [
  {
    id: 1,
    title: "HackLab",
    description: "A web app for developers to find teams and enhance the development process for projects.",
    skills: ["Node.js", "AWS", "PostgreSQL", "Websockets", "Next.js", "Tailwind"],
    image: "/images/juno.png",
    width: 258,
    height: 257,
  },
  {
    id: 2,
    title: "BPSmith",
    description: "A web app for applying or creating .bps patch files for Super Mario 64 ROMs.",
    skills: ["Bit Manipulation", "File Processing", "Encoding", "Next.js", "UI/UX"],
    image: "/images/bpsmith.png",
    width: 538,
    height: 319,
  },
  {
    id: 3,
    title: "Planet Destroyer",
    description: "An incremental game built in C# XNA; Generated 180+ itch.io downloads.",
    skills: ["C#", "XNA", "Animation", "Game Design", "Pixel Art"],
    image: "/images/planetdestroyer.png",
    width: 518,
    height: 308,
  },
  {
    id: 4,
    title: "Pentagon Pizza",
    description: "A website tracking pizza resturant activity near the Pentagon to estimate the PPI.",
    skills: ["Next.js", "Tailwind", "Webscraping", "Discord.js", "Webhooks"],
    image: "/images/penpizza.png",
    width: 1473,
    height: 956,
  },
];

// should change it to make tags not show on mobile they take too much space
// or maybe just show a couple like the main important ones
export default function HomeProjects() {
  return (
    <>
      <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
        <div className="max-w-3xl mx-auto flex flex-col items-start p-6 border-x border-dashed border-[var(--outline)]">
          <h2 className="font-space pb-2 text-xl sm:text-2xl md:text-3xl">Projects</h2>

          <div className="flex flex-col gap-1 w-full">
            {projects.map(project => (
              <ProjectSlider
                key={project.id}
                {...project}
              />
            ))}
          </div>
          <Link href="/projects" className="group rounded-sm flex flex-row items-center justify-center gap-2 font-sans text-sm md:text-base mt-6 ml-4 px-4 py-1 bg-light-background border border-transparent border-dashed hover:border-[var(--outline)]">
            See all
            <div className="rotate-45 -translate-y-[1px]">
              <Arrow />
            </div>

          </Link>
        </div>

      </section>
    </>
  );
}