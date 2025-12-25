import React, { useState, useEffect, useMemo } from 'react';
import PostCover from './PostCover';

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

export default function PostList({ initialPosts }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [isClientMode, setIsClientMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = import.meta.env.BASE_URL;

  // Load all posts when user interacts with sort
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
      <div className="flex justify-end mb-8">
        <div className="relative group z-20">
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-liquid text-sm font-medium text-[var(--color-primary)] hover:scale-105 transition-all duration-300"
            onMouseEnter={loadAllPosts}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            <span>{sortLabels[sortOption]}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className="absolute right-0 mt-2 w-40 py-2 rounded-2xl glass-liquid opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right">
            {(Object.keys(sortLabels) as SortOption[]).map((option) => (
              <button
                key={option}
                onClick={() => handleSortChange(option)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-surface)] transition-colors ${
                  sortOption === option ? 'text-[var(--color-accent)] font-bold' : 'text-[var(--color-secondary)]'
                }`}
              >
                {sortLabels[option]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {isLoading ? (
            <div className="py-20 text-center text-[var(--color-secondary)] animate-pulse">
                Loading...
            </div>
        ) : (
            sortedPosts.map((post, index) => (
            <article 
                key={post.slug}
                className="group relative flex flex-col md:flex-row gap-6 md:gap-8 items-start p-4 -mx-4 rounded-3xl hover:bg-[var(--color-surface)] transition-colors duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
            >
                <a href={`${baseUrl}blog/${post.slug}`} className="block md:w-1/3 shrink-0 w-full">
                <PostCover 
                    title={post.title} 
                    image={post.heroImage} 
                    category={post.category}
                    className="aspect-[4/3] rounded-2xl shadow-sm border border-[var(--color-border)]"
                />
                </a>
                
                <div className="flex-1 flex flex-col justify-center py-2 w-full">
                <div className="flex items-center gap-3 text-xs font-medium text-[var(--color-secondary)] mb-3 uppercase tracking-wider">
                    <time dateTime={post.pubDate}>
                    {new Date(post.pubDate).toLocaleDateString('en-us', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                    </time>
                    <span className="w-1 h-1 rounded-full bg-[var(--color-accent)]"></span>
                    <span>{post.category}</span>
                </div>
                
                <a href={`${baseUrl}blog/${post.slug}`} className="group-hover:text-[var(--color-accent)] transition-colors">
                    <h2 className="text-2xl font-bold mb-3 leading-tight">
                    {post.title}
                    </h2>
                </a>
                
                <p className="text-[var(--color-secondary)] line-clamp-2 mb-4 leading-relaxed">
                    {post.description}
                </p>
                
                <a href={`${baseUrl}blog/${post.slug}`} className="inline-flex items-center text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors">
                    Read Article 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </a>
                </div>
            </article>
            ))
        )}
      </div>
      
      {/* Pagination Hint (Only show if not in client mode) */}
      {!isClientMode && (
          <div className="mt-12 pt-8 border-t border-[var(--color-border)] text-center text-sm text-[var(--color-secondary)]">
              <p>切换排序方式以查看所有文章</p>
          </div>
      )}
    </div>
  );
}
