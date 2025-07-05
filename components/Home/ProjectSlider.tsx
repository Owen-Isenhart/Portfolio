import Image from "next/image";
import Link from "next/link"

interface ProjectSliderProps {
  title: string;
  description: string;
  skills: string[];
  image?: string; 
  width?: number;
  height?: number;
}

export default function ProjectSlider(props: ProjectSliderProps) {
  const link = `/projects/${props.title}`;
  return (
    <Link href={link} className="group relative flex w-full overflow-hidden border border-transparent hover:border-dashed hover:border-outline hover:cursor-pointer">
      <div className="flex w-full flex-col p-4 font-sans">
        <h3 className="text-lg font-semibold lg:text-xl">{props.title}</h3>
        <p className="pb-2 text-sm md:text-base">{props.description}</p>
        <div className="font-mono flex flex-wrap gap-2">
          {props.skills.map(skill => (
            <span key={skill} className="rounded-sm border-outline bg-light-background px-2 py-1 text-xs">
              {skill}
            </span>
          ))}
        </div>
      </div>
      {props.image && 
        <div
        className="absolute right-0 top-0 w-48 transform-gpu transition-transform duration-400 ease-in-out 
               translate-x-full group-hover:translate-x-0"
      >
        <Image
          src={props.image}
          alt={props.title}
          width={props.width}
          height={props.height}
          style={{ objectFit: "contain" }}
        />
      </div>
      }
      
    </Link>
  );
}