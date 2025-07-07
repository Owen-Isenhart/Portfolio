import Image from 'next/image';
import Arrow from "../General/Arrow"
interface ProjectProps {
  id: number;
  title: string;
  coverImage: string;
  description: string;
  overview: string;
  skills: string[];
  features: string[];
  link?: string;
}

export default function Project(props: ProjectProps) {
  return (
    <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
      <div className="max-w-3xl mx-auto flex flex-col items-start p-6 border-x border-dashed border-[var(--outline)]">
        <h1 className="font-space pb-2 text-xl sm:text-2xl md:text-3xl">{props.title}</h1>
        <p className="font-sans text-base md:text-lg pr-6 pb-4 text-light-foreground">{props.description}</p>

        {props.coverImage && (
          <div className="w-full mb-8">
            <Image
              src={props.coverImage}
              alt={props.title}
              width={1200}
              height={675}
              className="rounded-lg object-cover"
            />
          </div>
        )}

        <div className="w-full">
          <h2 className="font-space pb-2 text-xl sm:text-2xl">Overview</h2>
          <p className="font-sans text-base md:text-lg pb-6">{props.overview}</p>

          <h2 className="font-space pb-2 text-xl sm:text-2xl">Key Features</h2>
          <ul className="list-disc list-inside pb-6">
            {props.features.map((feature, index) => {
              const [featureTitle, featureDesc] = feature.split(':');
              return (
                <li key={index} className="font-sans text-base md:text-lg mb-2">
                  <strong>{featureTitle}:</strong> {featureDesc}
                </li>
              )
            })}
          </ul>


          <h2 className="font-space pb-2 text-xl sm:text-2xl">Skills & Technologies</h2>
          <div className="font-mono flex flex-wrap gap-2 pb-6">
            {props.skills.map(skill => (
              <span key={skill} className="rounded-sm border-outline bg-light-background px-2 py-1 text-xs">
                {skill}
              </span>
            ))}
          </div>

          {props.link && (
            <div className="group font-mono tracking-tight underline decoration-from-font underline-offset-2 pb-1 hover:cursor-pointer hover:decoration-[var(--accent)] hover:underline-offset-3 transition-all ease-in-out duration-300 flex flex-row">
              <a className="text-sm md:text-base" href={props.link} rel="noopener noreferrer">Check it out </a> <Arrow />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}