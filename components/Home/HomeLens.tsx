import Link from "next/link";
import Image from "next/image";
import Arrow from "../General/Arrow";


export default function HomeLens() {
  return (
    <>
      <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
        <div className="max-w-3xl mx-auto flex flex-col items-start p-6 border-x border-dashed border-[var(--outline)]">
          <h2 className="font-space pb-2 text-xl sm:text-2xl md:text-3xl">Lens</h2>
          <div className="p-4 grid grid-cols-3 gap-4 w-full">
            {/* just gonna do first three images. on actualy lens page, we can just loop through and replace the img num with a variable */}
            <Image className="w-full aspect-[3/4] object-cover rounded-lg" src="/images/lens/img_1.jpg" alt="Mountains at Flagstaff" width={500} height={500} />
            <Image className="w-full aspect-[3/4] object-cover rounded-lg" src="/images/lens/img_2.jpg" alt="Dinky on the porch" width={500} height={500} />
            <Image className="w-full aspect-[3/4] object-cover rounded-lg" src="/images/lens/img_3.jpg" alt="HackLab presentation rehearsal" width={500} height={500} />
          </div>
          <Link href="/lens" className="group rounded-sm flex flex-row items-center justify-center gap-2 font-sans text-sm md:text-base mt-6 ml-4 px-4 py-1 bg-light-background border border-transparent border-dashed hover:border-[var(--outline)]">
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