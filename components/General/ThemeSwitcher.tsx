'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { SunMoon } from "lucide-react";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={`hover:cursor-pointer text-[var(--accent)]`}>
      <SunMoon />
    </button>
  );
};