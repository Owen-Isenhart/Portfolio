export default function LensPics() {
  const totalImages = 24;

  const imageNumbers = Array.from({ length: totalImages }, (_, i) => i + 1);

  return (
    <>
      <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
        <div className="max-w-3xl border-x border-outline border-dashed container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 items-start">
          {imageNumbers.map((number) => (
            <div key={number} className="w-full h-auto aspect-square">
              <img
                src={`/images/lens/img_${number}.avif`}
                alt={`Showcase image ${number}`}
                className="w-full h-full object-cover rounded-md shadow-lg"
                loading="lazy" 
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}