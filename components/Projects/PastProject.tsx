import ProjectSlider from "../Home/ProjectSlider";

const projects = [
  {
    id: 1,
    title: "Expansion Patch",
    coverImage: "images/oxef.jpg",
    description: "A web app for developers to find teams and enhance the development process for projects.",
    overview: "",
    skills: ["Node.js", "AWS", "PostgreSQL", "Websockets", "Next.js", "Tailwind"],
    features: ["bob"],
    carousell: ["images/oxef.jpg", "images/oxef.jpg"],
    link: "google.com",
  },
  {
    id: 2,
    title: "Yoyoyo",
    coverImage: "images/oxef.jpg",
    description: "A web app for developers to find teams and enhance the development process for projects.",
    overview: "",
    skills: ["Node.js", "AWS", "PostgreSQL", "Websockets", "Next.js", "Tailwind"],
    features: ["bob"],
    carousell: ["images/oxef.jpg", "images/oxef.jpg"],
    link: "google.com",
  },
];

// id: number,
//   title: string,
//   coverImage: string,
//   description: string, // short description
//   overview: string, // in depth overview
//   skills: string[],
//   features: string[], // format strings like "feature; description"
//   carousell?: string[], // images that will rotate through a carousell
//   link?: string[],

// should change it to make tags not show on mobile they take too much space
// or maybe just show a couple like the main important ones
export default function PastProjects() {
  return (
    <>
      <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
        <div className="max-w-3xl mx-auto flex flex-col items-start p-6 border-x border-dashed border-[var(--outline)]">
          <h2 className="font-space pb-2 text-xl sm:text-2xl md:text-3xl">Completed Projects</h2>

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