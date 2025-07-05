import Name from "../General/Name";
import Arrow from "../General/Arrow";
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';
// getting message that says these icons are deprecated but they still work so idk

export default function Footer() {
  return (
    <>
      <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
        <div className="max-w-3xl mx-auto flex flex-col items-start p-6 border-x border-dashed border-[var(--outline)]">
          <h2 className="font-space pb-2 text-xl sm:text-2xl md:text-3xl">Connect with me!</h2>
          <p className="font-sans">If you want to get in touch with me about something, contact me using one of the methods below.</p>

          <div className="flex flex-wrap text-foreground items-center gap-x-6 gap-y-4 mt-6 font-sans">
            <div className="flex w-full sm:w-[calc(50%-0.75rem)] md:w-auto">
              <a className="group flex flex-row" href="" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                <Linkedin className="w-6 h-6 text-foreground transition-colors group-hover:text-blue-400" />
                <p className="pl-2 translate-y-[3px] font-mono tracking-tight underline decoration-from-font underline-offset-2 pb-1 hover:cursor-pointer hover:decoration-[var(--accent)] hover:underline-offset-3 transition-all ease-in-out duration-300">
                  LinkedIn
                </p>
                <Arrow />
              </a>
            </div>

            <div className="flex w-full sm:w-[calc(50%-0.75rem)] md:w-auto">
              <a className="group flex flex-row" href="" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
                <Github className="w-6 h-6 text-foreground transition-colors group-hover:text-gray-400" />
                <p className="pl-2 translate-y-[3px] font-mono tracking-tight underline decoration-from-font underline-offset-2 pb-1 hover:cursor-pointer hover:decoration-[var(--accent)] hover:underline-offset-3 transition-all ease-in-out duration-300">
                  GitHub
                </p>
                <Arrow />
              </a>
            </div>

            <div className="flex w-full sm:w-[calc(50%-0.75rem)] md:w-auto">
              <a className="group flex flex-row" href="" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile">
                <Instagram className="w-6 h-6 text-foreground transition-colors group-hover:text-pink-500" />
                <p className="pl-2 translate-y-[3px] font-mono tracking-tight underline decoration-from-font underline-offset-2 pb-1 hover:cursor-pointer hover:decoration-[var(--accent)] hover:underline-offset-3 transition-all ease-in-out duration-300">
                  Instagram
                </p>
                <Arrow />
              </a>
            </div>

            <div className="flex w-full sm:w-[calc(50%-0.75rem)] md:w-auto">
              <a className="group flex flex-row" href="" target="_blank" rel="noopener noreferrer" aria-label="Email">
                <Mail className="w-6 h-6 text-foreground transition-colors group-hover:text-red-500" />
                <p className="pl-2 translate-y-[3px] font-mono tracking-tight underline decoration-from-font underline-offset-2 pb-1 hover:cursor-pointer hover:decoration-[var(--accent)] hover:underline-offset-3 transition-all ease-in-out duration-300">
                  Email
                </p>
                <Arrow />
              </a>
            </div>
          </div>

        </div>
      </section>
      <Name />
    </>
  );
}