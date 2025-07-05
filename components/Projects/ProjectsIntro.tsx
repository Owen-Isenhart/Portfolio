export default function ProjectsIntro() {
  return (
    <>
      <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
          <div className="flex flex-row mx-auto max-w-3xl items-start p-6 border-x border-dashed border-[var(--outline)]">
            <div className="max-w-3xl w-full mx-auto flex flex-col items-start">
              <h2 className="font-space pb-2 text-xl sm:text-2xl md:text-3xl">Projects</h2>
              <p className="font-sans text-sm md:text-base pr-6 pb-2">Check out some of my work!
              </p>
            </div>
          </div>
        </section>
    </>
  );
}