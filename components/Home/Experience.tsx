"use client";

import Image from "next/image";
import { useState } from "react";
import { Circle } from "lucide-react";
import Arrow from "../General/Arrow"

export default function Experience() {
  const [showMore, setShowMore] = useState(false);

  const buttonStyles = "group rounded-sm flex flex-row items-center justify-center gap-2 font-sans text-xs md:text-sm px-4 py-1 bg-light-background border border-transparent border-dashed hover:border-[var(--outline)] hover:cursor-pointer";
  // the divs probably should've been made into components but it's fine
  return (
    <>
      <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
        <div className="max-w-3xl mx-auto flex flex-col items-start p-6 border-x border-dashed border-[var(--outline)]">
          <h2 className="font-space pb-2 text-xl sm:text-2xl md:text-3xl">Experience</h2>

          {/* acm projects + dev */}
          <div className="flex flex-row items-start gap-5 pb-2">
            <Image className="w-15 lg:w-18 invert-on-dark" src="/images/acm.avif" width={200} height={200} alt="acm-logo" />
            <div className="flex-col">
              <h3 className="font-mono tracking-tight text-md sm:text-lg md:text-xl">
                ACM
              </h3>
              <div className="flex flex-row items-center gap-1">
                <Circle className="w-2" fill="var(--foreground)" strokeWidth={0} />
                <p className="font-sans font-semibold text-sm md:text-base text-foreground pb-1">
                  Development Officer <span className="font-normal text-light-foreground text-xs md:text-sm">(May 2025 - Current)</span>
                </p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <Circle className="w-2" strokeWidth={0} />
                <p className="font-sans text-sm md:text-base text-foreground pb-1">
                  Working on the backend of BSG, a web app and chrome extension made for students to collaboratively practice LeetCode problems.
                </p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <Circle className="w-2" fill="var(--foreground)" strokeWidth={0} />
                <p className="font-sans font-semibold text-sm md:text-base text-foreground pb-1">
                  Projects Participant <span className="font-normal text-light-foreground text-xs md:text-sm">(Feb 2025 - Apr 2025)</span>
                </p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <Circle className="w-2" strokeWidth={0} />
                <p className="font-sans text-sm md:text-base text-foreground pb-1">
                  On the backend for HackLab, ACM Projects' 1st place and best design winner, I built a Node and Express API (deployed on AWS EC2),
                  real-time chat, and an AI resume generator using Gemini, the GitHub API, and LinkedIn webscraping to create tailored LaTeX resumes from LinkedIn data.
                </p>
              </div>
            </div>
          </div>
          {/* gdsc */}
          <div className="flex flex-row items-start gap-5 pb-2">
            <Image className="w-15 lg:w-18" src="/images/gdsc.avif" width={200} height={200} alt="gdsc-logo" />
            <div className="flex-col">
              <h3 className="font-mono tracking-tight text-md sm:text-lg md:text-xl">
                GDSC
              </h3>
              <div className="flex flex-row items-center gap-1">
                <Circle className="w-2" fill="var(--foreground)" strokeWidth={0} />
                <p className="font-sans font-semibold text-sm md:text-base text-foreground pb-1">
                  Technical Committee Officer <span className="font-normal text-light-foreground text-xs md:text-sm">(May 2025 - Current)</span>
                </p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <Circle className="w-2" strokeWidth={0} />
                <p className="font-sans text-sm md:text-base text-foreground pb-1">
                  Contributed to the design and development of the UTD GDSC website, host workshops teaching students web development, and help plan and assist with other officer's workshops.
                </p>
              </div>
            </div>
          </div>
          {/* utd athletics */}
          <div className="flex flex-row items-start gap-5 pb-2">
            <Image className="w-15 lg:w-18" src="/images/utd.avif" width={200} height={200} alt="utd-logo" />
            <div className="flex-col">
              <h3 className="font-mono tracking-tight text-md sm:text-lg md:text-xl">
                UTD Athletics
              </h3>
              <div className="flex flex-row items-center gap-1">
                <Circle className="w-2" fill="var(--foreground)" strokeWidth={0} />
                <p className="font-sans font-semibold text-sm md:text-base text-foreground pb-1">
                  Student Assistant <span className="font-normal text-light-foreground text-xs md:text-sm">(Aug 2024 - Current)</span>
                </p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <Circle className="w-2" strokeWidth={0} />
                <p className="font-sans text-sm md:text-base text-foreground pb-1">
                  Execute and assist with all phases of game day logistics for the UTD Athletics department, including setup, operational oversight, fan assistance, and teardown to ensure successful events.
                </p>
              </div>
            </div>
          </div>

          {/* show more button (if not expanded) */}
          {/* arrow is rotate to point down */}
          {!showMore && (
            <div className="w-full flex justify-center py-4">
              <button onClick={() => setShowMore(true)} className={buttonStyles}>
                Show more
                <div className="rotate-135 translate-y-[2px] group-hover:-translate-y-[1px] transition-transform duration-300">
                  <Arrow />
                </div>
              </button>
            </div>
          )}

          {/* collapsible section */}
          <div className={`grid w-full transition-all duration-500 ease-in-out ${showMore ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              {/* the ups store */}
              <div className="flex flex-row items-start gap-5 pb-2">
                <Image className="w-15 lg:w-18" src="/images/ups.avif" width={200} height={200} alt="ups-logo" />
                <div className="flex-col">
                  <h3 className="font-mono tracking-tight text-md sm:text-lg md:text-xl">
                    The UPS Store
                  </h3>
                  <div className="flex flex-row items-center gap-1">
                    <Circle className="w-2" fill="var(--foreground)" strokeWidth={0} />
                    <p className="font-sans font-semibold text-sm md:text-base text-foreground pb-1">
                      Retail Sales Associate <span className="font-normal text-light-foreground text-xs md:text-sm">(Oct 2024 - Mar 2025)</span>
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <Circle className="w-2" strokeWidth={0} />
                    <p className="font-sans text-sm md:text-base text-foreground pb-1">
                      Served as a primary point of contact for customers, providing expert guidance across a wide range of services. Daily responsibilities included advising customers on the most effective shipping and packaging
                      solutions, handling print jobs, and processing returns, scans, and faxes.
                    </p>
                  </div>
                </div>
              </div>
              {/* snappy salads */}
              <div className="flex flex-row items-start gap-5 pb-2">
                <Image className="w-15 lg:w-18" src="/images/snappy.avif" width={200} height={200} alt="snappy-salads-logo" />
                <div className="flex-col">
                  <h3 className="font-mono tracking-tight text-md sm:text-lg md:text-xl">
                    Snappy Salads
                  </h3>
                  <div className="flex flex-row items-center gap-1">
                    <Circle className="w-2" fill="var(--foreground)" strokeWidth={0} />
                    <p className="font-sans font-semibold text-sm md:text-base text-foreground pb-1">
                      Team Member <span className="font-normal text-light-foreground text-xs md:text-sm">(May 2022 - Aug 2022)</span>
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <Circle className="w-2" strokeWidth={0} />
                    <p className="font-sans text-sm md:text-base text-foreground pb-1">
                      Thrived in a fast-paced environment by handling a wide variety of duties, ranging from providing direct customer service, taking orders,
                      operating the register, and crafting salads, to supporting kitchen operations through food prep, dishwashing, and daily closing procedures.
                    </p>
                  </div>
                </div>
              </div>

              {/* show less button (if expanded) */}
              {/* arrow is rotated to point up */}
              <div className="w-full flex justify-center py-4">
                <button onClick={() => setShowMore(false)} className={buttonStyles}>
                  Show less
                  <div className="-rotate-45 -translate-y-[1px] group-hover:translate-y-[2px] transition-transform duration-300">
                    <Arrow />
                  </div>
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>
    </>
  );
}