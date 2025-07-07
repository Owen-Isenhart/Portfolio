'use client';

import { useParams } from 'next/navigation';
import { projects } from '@/lib/projects'; 
import Project from '@/components/Projects/Project'; 
import NavBar from '@/components/General/NavBar';
import Footer from '@/components/General/Footer';
import { notFound } from 'next/navigation';

export default function ProjectPage() {
  const params = useParams();
  const title = params.title;
  console.log(title);
  const decodedTitle = decodeURIComponent(title as string);
  console.log(decodedTitle);
  const project = projects.find(p => p.title === decodedTitle);

  if (!project) {
    return notFound();
  }

  return (
    <>
      <NavBar />
      <main>
        <Project {...project} />
      </main>
      <Footer />
    </>
  );
}