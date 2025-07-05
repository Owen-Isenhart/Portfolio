// can be rotated to any direction but default goes up right
export default function Arrow() {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className="group size-4 fill-none stroke-light-foreground stroke-[2px] transition-opacity duration-300 ease-in-out ml-1 size-3.5 -rotate-45 hover:cursor-pointer group-hover:stroke-[var(--accent)]"
    >
      <line 
        x1="5" y1="12" x2="19" y2="12" 
        className="translate-x-[10px] scale-x-0 transition-transform duration-300 ease-in-out group-hover:translate-x-0 group-hover:scale-x-100"
      >
      </line>
      <polyline 
        points="12 5 19 12 12 19" 
        className="-translate-x-2 transition-transform duration-300 ease-in-out group-hover:translate-x-0"
      >
      </polyline>
    </svg>
  );
}