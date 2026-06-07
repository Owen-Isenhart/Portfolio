import dynamic from "next/dynamic"
import Image from 'next/image';
import NavBar from '../../../components/General/NavBar';
const Footer = dynamic(() => import('../../../components/General/Footer'));
import { notFound } from 'next/navigation';
import React, { isValidElement } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import { getNoteBySlug, getNoteSlugs } from '../../../lib/notes';
import NoteComments from '../../../components/Notes/NoteComments';
import SuccessPredictorDashboard from '../../../components/Notes/SuccessPredictorDashboard';

const SUCCESS_PREDICTOR_SHORTCODE = '#file:success_predictor_interactive_dashboard';
const SUCCESS_PREDICTOR_ALT_SHORTCODE = '[[success-predictor]]';
const SUCCESS_PREDICTOR_SHORTCODE_PATTERN = /(\#file:success_predictor_interactive_dashboard|\[\[success-predictor\]\])/g;

function normalizeAssetPath(src?: string | Blob) {
  if (typeof src !== 'string' || !src) {
    return '';
  }

  if (src.startsWith('/')) {
    return src;
  }

  if (src.startsWith('public/')) {
    return `/${src.slice('public/'.length)}`;
  }

  return `/${src}`;
}

function normalizeMarkdownForImages(markdown: string) {
  const blocks = markdown.split(/\n{2,}/);
  const normalizedBlocks: string[] = [];
  let pendingImages: string[] = [];

  const flushPendingImages = () => {
    if (pendingImages.length === 0) {
      return;
    }

    normalizedBlocks.push(pendingImages.join(' '));
    pendingImages = [];
  };

  for (const block of blocks) {
    const trimmedBlock = block.trim();

    if (!trimmedBlock) {
      flushPendingImages();
      continue;
    }

    const isImageOnlyBlock = /^!\[[^\]]*\]\([^\)]+\)(\s*!\[[^\]]*\]\([^\)]+\))*$/.test(trimmedBlock.replace(/\n/g, ' '));

    if (isImageOnlyBlock) {
      pendingImages.push(trimmedBlock.replace(/\n+/g, ' '));
      continue;
    }

    flushPendingImages();
    normalizedBlocks.push(trimmedBlock);
  }

  flushPendingImages();

  return normalizedBlocks.join('\n\n');
}

function isImageNode(node: React.ReactNode) {
  return isValidElement(node) && typeof (node.props as { src?: unknown }).src !== 'undefined';
}

function isIgnorableNode(node: React.ReactNode) {
  return node === null || node === undefined || node === false || node === true || node === '' || node === '\n' || node === ' ';
}

const markdownComponents: Components = {
  h1: ({ children }) => <h1 className="font-space pb-1 text-xl sm:text-2xl md:text-3xl">{children}</h1>,
  h2: ({ children }) => <h2 className="font-space font-semibold pb-1 text-lg sm:text-xl md:text-2xl">{children}</h2>,
  h3: ({ children }) => <h3 className="font-space font-medium pb-1 text-base sm:text-lg md:text-xl">{children}</h3>,
  p: ({ children }) => {
    const childNodes = React.Children.toArray(children).filter(node => !isIgnorableNode(node));
    const imageNodes = childNodes.filter(isImageNode);
    const textNodes = childNodes.filter(node => !isImageNode(node));

    if (childNodes.length > 0 && imageNodes.length === childNodes.length) {
      return (
        <div className="mb-5 flex w-full flex-wrap justify-center gap-2">
          {imageNodes.map((child, index) =>
            React.cloneElement(child as React.ReactElement<{ className?: string }>, {
              key: index,
              className: 'inline-block max-h-[25vh] w-auto max-w-[45%] rounded-sm object-contain',
            })
          )}
        </div>
      );
    }

    if (imageNodes.length > 0) {
      return (
        <div className="mb-5 w-full">
          <div className="flex w-full flex-wrap justify-center gap-2">
            {imageNodes.map((child, index) =>
              React.cloneElement(child as React.ReactElement<{ className?: string }>, {
                key: index,
                className: 'inline-block max-h-[25vh] w-auto max-w-[45%] rounded-sm object-contain',
              })
            )}
          </div>
          {textNodes.length > 0 ? (
            <div className="mt-3 text-sm sm:text-base md:text-lg">
              {textNodes.map((node, index) => (
                <React.Fragment key={index}>{node}</React.Fragment>
              ))}
            </div>
          ) : null}
        </div>
      );
    }

    return <p className="pb-5 text-sm sm:text-base md:text-lg">{children}</p>;
  },
  a: ({ children, ...props }) => {
    const href = (props as React.ComponentPropsWithoutRef<'a'>).href;
    return (
      <span className="tracking-tight underline decoration-from-font underline-offset-2 pb-1 hover:cursor-pointer hover:decoration-[var(--accent)] hover:underline-offset-3 transition-all ease-in-out duration-300 inline-flex items-center">
        <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
      </span>
    );
  },
  ul: ({ children }) => <ul className="mb-5 ml-6 list-disc space-y-2 text-sm sm:text-base md:text-lg">{children}</ul>,
  ol: ({ children }) => <ol className="mb-5 ml-6 list-decimal space-y-2 text-sm sm:text-base md:text-lg">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  blockquote: ({ children }) => <blockquote className="mb-5 border-l-2 border-[var(--outline)] pl-4 italic">{children}</blockquote>,
  code: ({ inline, children, ...props }: React.ComponentPropsWithoutRef<'code'> & { inline?: boolean }) => {
    if (inline) {
      return (
        <code className="rounded bg-light-background px-1 py-0.5 font-mono text-[0.9em]" {...props}>
          {children}
        </code>
      );
    }

    return (
      <code className="block overflow-x-auto rounded bg-light-background p-4 font-mono text-sm" {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="mb-5 overflow-x-auto rounded bg-light-background p-4">{children}</pre>,
  img: ({ alt, src, className }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt ?? ''}
      src={normalizeAssetPath(src)}
      className={`rounded-sm object-contain ${className ?? ''}`.trim()}
    />
  ),
};

export async function generateStaticParams() {
  const slugs = await getNoteSlugs();

  return slugs.map(slug => ({
    slug,
  }));
}

async function getNoteData(slug: string) {
  return getNoteBySlug(slug);
}

export default async function NotePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const note = await getNoteData(params.slug);

  if (!note) {
    return notFound();
  }

  return (
    <>
      <NavBar />
      <main>
        <section className="bg-[var(--background)] border-b border-dashed border-[var(--outline)]">
          <article className="max-w-3xl mx-auto flex flex-col items-start p-6 border-x border-dashed border-[var(--outline)] text-foreground font-sans">
            <h1 className="font-space pb-1 text-xl sm:text-2xl md:text-3xl">{note.title}</h1>
            <p className="text-sm text-light-foreground">
              By {note.author} on {new Date(note.date).toLocaleDateString()}
            </p>
            <div className="flex flex-wrap gap-2 mt-3 mb-5">
              {note.tags.map(tag => (
                <span key={tag} className="bg-light-background text-xs px-2 py-1 rounded-sm font-mono no-underline">
                  {tag}
                </span>
              ))}
            </div>

            {note.coverImage ? (
              <Image
                src={normalizeAssetPath(note.coverImage)}
                alt={note.title}
                className="mb-5 h-auto w-full rounded-sm"
                width={1200}
                height={630}
                priority
              />
            ) : null}

            {normalizeMarkdownForImages(note.content)
              .split(SUCCESS_PREDICTOR_SHORTCODE_PATTERN)
              .map((chunk, index) => {
                const trimmedChunk = chunk.trim();

                if (trimmedChunk === SUCCESS_PREDICTOR_SHORTCODE || trimmedChunk === SUCCESS_PREDICTOR_ALT_SHORTCODE) {
                  return <SuccessPredictorDashboard key={`success-predictor-${index}`} />;
                }

                if (!trimmedChunk) {
                  return null;
                }

                return (
                  <ReactMarkdown key={`markdown-${index}`} components={markdownComponents}>
                    {chunk}
                  </ReactMarkdown>
                );
              })}

            <NoteComments slug={note.slug} />
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
}