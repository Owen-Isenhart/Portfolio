'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation'; 
import { ThemeSwitcher } from "./ThemeSwitcher";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/notes", label: "Notes" },
];
// not gonna have a link to lens bc it's not important and don't want nav bar cluttered

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-[var(--background)] sticky top-0 z-50 border-b border-dashed border-[var(--outline)]">
      <div className="max-w-3xl mx-auto flex h-14 items-center justify-between p-6 border-x border-dashed border-[var(--outline)]">
        
        <div className="font-space space-x-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  text-[var(--foreground)] hover:text-[var(--light-foreground)] 
                  text-sm decoration-[0.1em] underline-offset-4 
                  hover:underline hover:decoration-wavy
                  ${isActive ? 'underline decoration-wavy decoration-[var(--accent)]' : ''}
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        
        <div>
          <ThemeSwitcher />
        </div>

      </div>
    </nav>
  );
}