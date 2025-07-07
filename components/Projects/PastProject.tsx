import ProjectSlider from "../Home/ProjectSlider";
import { projects } from "../../lib/projects";

const past = projects.filter(project => !project.ongoing);

export default function PastProjects() {
  return (
    <>
      <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
        <div className="max-w-3xl mx-auto flex flex-col items-start p-6 border-x border-dashed border-[var(--outline)]">
          <h2 className="font-space pb-2 text-xl sm:text-2xl md:text-3xl">Completed Projects</h2>

          <div className="flex flex-col gap-1 w-full">
            {past.map(project => (
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