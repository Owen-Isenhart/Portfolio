import Link from "next/link";
import Arrow from "../General/Arrow";

// nothing here yet bc i need to integrate with notion
export default function HomeNotes() {
  return (
    <>
      <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
        <div className="max-w-3xl mx-auto flex flex-col items-start p-6 border-x border-dashed border-[var(--outline)]">
          <h2 className="font-space pb-2 text-xl sm:text-2xl md:text-3xl">Notes</h2>
          <div className="flex flex-col gap-1 w-full">
            
          </div>
          <Link href="/notes" className="group rounded-sm flex flex-row items-center justify-center gap-2 font-sans text-sm md:text-base mt-6 ml-4 px-4 py-1 bg-light-background border border-transparent border-dashed hover:border-[var(--outline)]">
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