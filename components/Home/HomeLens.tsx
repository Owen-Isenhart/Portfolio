import Link from "next/link";
import Image from "next/image";
import Arrow from "../General/Arrow";


export default function HomeLens() {
  const lensPreviewImages = [
    {
      src: "/images/lens/img_1.avif",
      alt: "Mountains at Flagstaff",
    },
    {
      src: "/images/lens/img_2.avif",
      alt: "Dinky on the porch",
    },
    {
      src: "/images/lens/img_3.avif",
      alt: "HackLab presentation rehearsal",
    },
  ];

  return (
    <>
      <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
        <div className="max-w-3xl mx-auto flex flex-col items-start p-6 border-x border-dashed border-[var(--outline)]">
          <h2 className="font-space pb-2 text-xl sm:text-2xl md:text-3xl">Lens</h2>
          <div className="p-4 grid grid-cols-3 gap-4 w-full">
            {lensPreviewImages.map((image, index) => (
              <Image
                key={image.src}
                className="w-full aspect-[3/4] object-cover rounded-lg"
                src={image.src}
                alt={image.alt}
                width={500}
                height={500}
                sizes="(max-width: 640px) 30vw, 180px"
                priority
                loading="eager"
                fetchPriority={index === 0 ? "high" : "auto"}
              />
            ))}
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