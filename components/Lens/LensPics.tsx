import Image from "next/image";

export default function LensPics() {
  const totalImages = 27;
  const eagerImageCount = 9;

  const imageNumbers = Array.from({ length: totalImages }, (_, i) => i + 1);

  return (
    <>
      <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
        <div className="max-w-3xl border-x border-outline border-dashed container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 items-start">
          {imageNumbers.map((number, index) => (
            <div key={number} className="relative w-full h-auto aspect-square">
              <Image
                src={`/images/lens/img_${number}.avif`}
                alt={`Showcase image ${number}`}
                className="w-full h-full object-cover rounded-md shadow-lg"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={index < eagerImageCount}
                loading={index < eagerImageCount ? "eager" : "lazy"}
                fetchPriority={index < eagerImageCount ? "high" : "auto"}
                unoptimized={number === 25}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}