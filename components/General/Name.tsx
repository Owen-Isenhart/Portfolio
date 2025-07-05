export default function Name() {
  return (
    <>
      <footer className="relative w-full h-[clamp(3rem,13vw,14rem)] z-10 flex justify-center text-[var(--foreground)] overflow-clip">
        <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 
          font-black tracking-normal opacity-30 whitespace-nowrap
          [text-rendering:geometricPrecision]
          text-[clamp(3rem,13vw,14rem)]
          bottom-[calc(-1*clamp(3rem,13vw,14rem)/1.75)]">
          Owen Isenhart
        </span>
        <div className="grid-effect"></div>
        <div className="gradient"></div>
      </footer>

      
    </>
  );
}