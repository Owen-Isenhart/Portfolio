import ProjectSlider from "../Home/ProjectSlider";

const projects = [
  {
    id: 1,
    title: "Expansion Patch",
    description: "A web app for developers to find teams and enhance the development process for projects.",
    skills: ["Node.js", "AWS", "PostgreSQL", "Websockets", "Next.js", "Tailwind"],
  },
  {
    id: 2,
    title: "Spacia",
    description: "A web app for applying or creating .bps patch files for Super Mario 64 ROMs.",
    skills: ["Bit Manipulation", "File Processing", "Encoding", "Next.js", "UI/UX"],
  },
];

// should change it to make tags not show on mobile they take too much space
// or maybe just show a couple like the main important ones
export default function OngoingProjects() {
  return (
    <>
      <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
        <div className="max-w-3xl mx-auto flex flex-col items-start p-6 border-x border-dashed border-[var(--outline)]">
          <h2 className="font-space pb-2 text-xl sm:text-2xl md:text-3xl">Current works in progress</h2>

          <div className="flex flex-col gap-1 w-full">
            {projects.map(project => (
              <ProjectSlider
                key={project.id}
                {...project}
              />
            ))}
          </div>
        </div>

      </section>
    </>
  );
}