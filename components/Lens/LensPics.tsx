export default function LensPics() {
  // Define the total number of images you want to display.
  const totalImages = 24;

  // Create an array from 1 to totalImages (e.g., [1, 2, 3, ... 12])
  const imageNumbers = Array.from({ length: totalImages }, (_, i) => i + 1);

  return (
    <>
      <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
        {/* Grid container */}
        <div className="max-w-3xl border-x border-outline border-dashed container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 items-start">
          {/* Loop through the array of image numbers */}
          {imageNumbers.map((number) => (
            <div key={number} className="w-full h-auto aspect-square">
              <img
                src={`/images/lens/img_${number}.jpg`}
                alt={`Showcase image ${number}`}
                className="w-full h-full object-cover rounded-md shadow-lg"
                loading="lazy" // Improves performance by loading images as they enter the viewport
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}