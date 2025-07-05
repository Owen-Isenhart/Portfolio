import Image from "next/image";
import Arrow from "../General/Arrow";
interface TopicProps {
  title: string;
  description: string;
  image: string[]; // could have multiple pics, but max three
  leftOrRight: boolean | null; // if there's only one picture, decide whether it goes on the left or right. if more than one just null bc they'll go below anyways
  link?: string;
  linkTitle?: string;
}

// stuff to eventually add:
// content creation , hardware (monster compass), investing???
export default function TopicSegment(props: TopicProps) {
  const gridColsMap: { [key: number]: string } = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  };

  return (
    <>
      <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
        <div className="flex flex-row mx-auto max-w-3xl items-start p-6 border-x border-dashed border-[var(--outline)]">
          <div className="max-w-3xl w-full mx-auto flex flex-col items-start">
            {/* picture on left */}
            {props.leftOrRight === true && <>
              <h2 className="font-space pb-2 text-xl sm:text-2xl md:text-3xl">{props.title}</h2>
              <div className="flex flex-row justify-between gap-6">
                <div className="w-1/2 md:w-1/3"> {/* It's often better to wrap the Image in a div for more control */}
                  <Image className="w-full h-full object-cover rounded-lg" src={props.image[0]} alt="Mountains at Flagstaff" width={3024} height={3024} />
                </div>
                <div className="w-2/3 flex-col">
                  <p className="w-full font-sans text-sm md:text-base pb-2">{props.description}</p>
                  {props.link && <>
                    <div className="group font-mono tracking-tight underline decoration-from-font underline-offset-2 pb-1 hover:cursor-pointer hover:decoration-[var(--accent)] hover:underline-offset-3 transition-all ease-in-out duration-300 flex flex-row">
                      <a className="text-sm md:text-base" href="" download="Owen-Isenhart-Resume.pdf">{props.linkTitle} </a> <Arrow />

                    </div>
                  </>}
                </div>
              </div>
            </>}

            {/* picture on right */}
            {props.leftOrRight === false && <>
              <h2 className="font-space pb-2 text-xl sm:text-2xl md:text-3xl">{props.title}</h2>
              <div className="flex flex-row justify-between gap-6">
                <p className="w-2/3 font-sans text-sm md:text-base pb-2">{props.description}</p>
                <div className="w-1/2 md:w-1/3"> {/* It's often better to wrap the Image in a div for more control */}
                  <Image className="w-full h-full object-cover rounded-lg" src={props.image[0]} alt="Mountains at Flagstaff" width={3024} height={3024} />
                </div>
              </div>
            </>}

            {/* multiple pictures and they'll be below text */}
            {props.leftOrRight === null && <>
              <h2 className="font-space pb-2 text-xl sm:text-2xl md:text-3xl">{props.title}</h2>
              <p className="w-full font-sans text-sm md:text-base pb-4">{props.description} </p>
              <div className={`grid ${gridColsMap[props.image.length] || 'grid-cols-1'} gap-4 w-full pb-4`}>
                {props.image.map(image => (
                  <Image key={image} className="w-full h-full object-fill rounded-lg" src={image} alt="Mountains at Flagstaff" width={1200} height={1700} />

                ))}
              </div>
              {props.link && <>
                <div className="group font-mono tracking-tight underline decoration-from-font underline-offset-2 hover:cursor-pointer hover:decoration-[var(--accent)] hover:underline-offset-3 transition-all ease-in-out duration-300 flex flex-row">
                  <a className="text-sm md:text-base" href="" download="Owen-Isenhart-Resume.pdf">{props.linkTitle} </a> <Arrow />

                </div>
              </>}
            </>}
          </div>
        </div>
      </section >
    </>
  );
}