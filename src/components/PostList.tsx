import React, { useState, useMemo, useEffect, useRef } from 'react';
import PostCover from './PostCover';
import { useSmartTruncate } from '../utils/textMeasure';
import { formatDate } from '../utils/date';

interface Post {
  title: string;
  description: string;
  slug: string;
  pubDate: string;
  category: string;
  heroImage?: string;
  tags?: string[];
}

interface Props {
  initialPosts: Post[];
}

type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';

// Individual post card with Pretext-powered excerpt
function PostCard({ post, index, baseUrl }: { post: Post; index: number; baseUrl: string }) {
  const descRef = useRef<HTMLParagraphElement>(null);
  const [descWidth, setDescWidth] = useState(400);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (descRef.current) {
      setDescWidth(descRef.current.clientWidth);
    }
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDescWidth(entry.contentRect.width);
      }
    });
    if (descRef.current) {
      observer.observe(descRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // IntersectionObserver for reveal
  useEffect(() => {
    const card = descRef.current?.closest('article');
    if (!card) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const font = '400 16px "Source Serif 4", "LXGW WenKai", "Noto Serif SC", serif';
  const lineHeight = 28;
  const truncated = useSmartTruncate(post.description, font, descWidth, lineHeight, 2);

  const isEven = index % 2 === 1;

  return (
    <article 
      key={post.slug}
      className={`group relative flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6 md:gap-10 items-start py-12 md:py-14 border-b border-[var(--color-border)] last:border-0 transition-all duration-700`}
      style={{
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${(index % 3) * 100}ms`,
      }}
    >
      <a href={`${baseUrl}blog/${post.slug}`} className={`block ${isEven ? 'md:w-[45%]' : 'md:w-[48%]'} shrink-0 w-full overflow-hidden border border-[var(--color-border)] group-hover:border-[var(--color-accent)] transition-colors duration-500`}>
        <PostCover 
          title={post.title} 
          image={post.heroImage} 
          category={post.category}
          className="aspect-[4/3] w-full h-full object-cover img-magazine"
        />
      </a>
      
      <div className="flex-1 flex flex-col justify-center py-1 w-full">
        <div className="flex items-center gap-3 text-[10px] font-sans font-semibold text-[var(--color-secondary)] mb-5 uppercase tracking-[0.15em]">
          <span className="text-[var(--color-accent)] font-display text-base opacity-40">{String(index + 1).padStart(2, '0')}</span>
          <span className="w-3 h-px bg-[var(--color-border)]"></span>
          <time dateTime={post.pubDate}>
            {formatDate(new Date(post.pubDate))}
          </time>
          <span className="w-1 h-1 bg-[var(--color-accent)] opacity-50"></span>
          <span className="text-[var(--color-primary)]">{post.category}</span>
        </div>
        
        <a href={`${baseUrl}blog/${post.slug}`} className="group/title block mb-4">
          <h2 className="text-2xl md:text-[1.75rem] leading-snug font-display font-bold text-[var(--color-primary)] group-hover/title:text-[var(--color-accent)] transition-colors duration-300">
            {post.title}
          </h2>
        </a>
        
        <p ref={descRef} className="text-[var(--color-secondary)] leading-relaxed mb-6 opacity-80 text-base">
          {truncated.text}
        </p>
        
        <a href={`${baseUrl}blog/${post.slug}`} className="inline-flex items-center text-sm font-sans font-semibold tracking-wide text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors group/link uppercase">
          <span className="link-underline">Read Article</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </article>
  );
}

export default function PostList({ initialPosts }: Props) {
  const posts = initialPosts;
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [isClientMode, setIsClientMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSortPanel, setShowSortPanel] = useState(false);

  const baseUrl = import.meta.env.BASE_URL;

  const loadAllPosts = async () => {
    if (allPosts.length > 0) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}search.json`);
      const data = await res.json();
      setAllPosts(data);
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = async (option: SortOption) => {
    setSortOption(option);
    setShowSortPanel(false);
    if (!isClientMode) {
      await loadAllPosts();
      setIsClientMode(true);
    }
  };

  const sortedPosts = useMemo(() => {
    const sourcePosts = isClientMode ? allPosts : posts;
    const sorted = [...sourcePosts];

    switch (sortOption) {
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf());
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.pubDate).valueOf() - new Date(b.pubDate).valueOf());
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  }, [posts, allPosts, sortOption, isClientMode]);

  const sortLabels: Record<SortOption, string> = {
    'date-desc': '最新发布',
    'date-asc': '最早发布',
    'title-asc': '标题 A-Z',
    'title-desc': '标题 Z-A',
  };

  return (
    <div>
      <div className="flex justify-end mb-10">
        <div className="relative">
          <button 
            className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-sans font-semibold tracking-wide text-[var(--color-primary)] hover:border-[var(--color-accent)] transition-all duration-300 uppercase"
            onClick={() => {
              setShowSortPanel(!showSortPanel);
              if (!isClientMode) {
                void loadAllPosts();
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--color-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            <span>{sortLabels[sortOption]}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-[var(--color-secondary)] transition-transform duration-300 ${showSortPanel ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showSortPanel && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSortPanel(false)} />
              <div className="absolute right-0 mt-2 w-44 py-2 border border-[var(--color-border)] bg-[var(--color-background)] shadow-xl z-20 animate-scale-in origin-top-right">
                {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSortChange(option)}
                    className={`w-full text-left px-4 py-2.5 text-sm font-sans transition-colors ${
                      sortOption === option ? 'text-[var(--color-accent)] font-bold' : 'text-[var(--color-secondary)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    {sortLabels[option]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div>
        {isLoading ? (
          <div className="py-20 text-center text-[var(--color-secondary)] animate-pulse font-sans">
            加载文章中...
          </div>
        ) : (
          sortedPosts.map((post, index) => (
            <PostCard key={post.slug} post={post} index={index} baseUrl={baseUrl} />
          ))
        )}
      </div>
      
      {!isClientMode && (
        <div className="mt-12 pt-8 border-t border-[var(--color-border)] text-center text-sm text-[var(--color-secondary)] font-sans opacity-60">
          <p>切换排序方式以查看所有文章</p>
        </div>
      )}
    </div>
  );
}
