import React, { useState, useEffect, useRef, useCallback } from 'react';
import { measureTextWidth } from '../utils/textMeasure';

interface Post {
    title: string;
    description: string;
    slug: string;
    pubDate: string;
    category: string;
}

export default function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Post[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const [inputWidth, setInputWidth] = useState(0);
    const [showTitle, setShowTitle] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const isLoadingRef = useRef(false);

    const baseUrl = import.meta.env.BASE_URL;

    const loadPosts = async () => {
        if (posts.length > 0 || isLoadingRef.current) return;
        isLoadingRef.current = true;
        setIsLoading(true);
        try {
            const res = await fetch(`${baseUrl}search.json`);
            const data = await res.json();
            setPosts(data);
        } catch (err) {
            console.error("Failed to load search index", err);
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
        }
    };

    const closeSearch = useCallback(() => {
        setIsOpen(false);
        setQuery('');
        setResults([]);
        setSelectedIndex(-1);
        setInputWidth(0);
        setShowTitle(false);
    }, []);

    useEffect(() => {
        if (!query || !inputRef.current) {
            setInputWidth(0);
            return;
        }
        try {
            const font = '400 20px "Newsreader", "Source Serif 4", serif';
            const width = measureTextWidth(query, font);
            const maxWidth = inputRef.current.clientWidth - 28;
            setInputWidth(Math.min(width, maxWidth));
        } catch {
            setInputWidth(query.length * 10);
        }
    }, [query]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeSearch();
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
                loadPosts();
            }
            if (!isOpen) return;
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => {
                    const max = results.length - 1;
                    return prev >= max ? 0 : prev + 1;
                });
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => {
                    const max = results.length - 1;
                    return prev <= 0 ? max : prev - 1;
                });
            }
            if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
                window.location.href = `${baseUrl}blog/${results[selectedIndex].slug}`;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex, closeSearch, baseUrl]);

    useEffect(() => {
        if (query.length === 0) {
            setResults([]);
            setSelectedIndex(-1);
            return;
        }
        const filtered = posts.filter(post =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.description.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered.slice(0, 8));
        setSelectedIndex(-1);
    }, [query, posts]);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setTimeout(() => setShowTitle(true), 200);
        }
    }, [isOpen]);

    return (
        <>
            {/* Magazine-style search trigger */}
            <button
                onClick={() => { setIsOpen(true); loadPosts(); }}
                className="group flex items-center gap-2 px-3 py-1.5 border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all duration-300 text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
                aria-label="搜索"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-xs font-sans font-semibold tracking-wide uppercase hidden md:inline transition-transform duration-300 group-hover:translate-x-0.5">
                    Search
                </span>
                <kbd className="hidden md:inline-flex items-center px-1 py-0.5 text-[10px] font-sans bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-[var(--color-secondary)]">
                    ⌘K
                </kbd>
            </button>

            {/* Search Panel — upper-half drawer */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-[100] flex flex-col"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeSearch();
                    }}
                >
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 xuanzhi-texture"
                        style={{ backgroundColor: 'color-mix(in oklch, var(--color-background) 96%, transparent)' }}
                    />
                    <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(to bottom, var(--color-surface), transparent)' }} />
                    
                    {/* Panel Content */}
                    <div 
                        ref={searchRef}
                        className="relative w-full max-w-3xl mx-auto px-5 md:px-10 pt-20 md:pt-28 pb-10"
                        style={{
                            animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
                        }}
                    >
                        {/* Animated Title */}
                        <div className="mb-10 overflow-hidden">
                            <h2 
                                className="text-sm font-sans font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)]"
                                style={{
                                    opacity: showTitle ? 1 : 0,
                                    transform: showTitle ? 'translateY(0)' : 'translateY(20px)',
                                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                                }}
                            >
                                Index
                            </h2>
                            <div 
                                className="golden-line mt-4"
                                style={{
                                    transform: showTitle ? 'scaleX(1)' : 'scaleX(0)',
                                    transformOrigin: 'left',
                                    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
                                }}
                            />
                        </div>

                        {/* Input */}
                        <div className="relative mb-8">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="搜索文章..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full h-14 pl-0 pr-10 bg-transparent border-0 border-b-2 border-[var(--color-border)] text-2xl md:text-3xl text-[var(--color-text)] placeholder-[var(--color-secondary)]/30 focus:outline-none focus:border-[var(--color-accent)] transition-colors font-display tracking-tight"
                            />
                            {/* Pretext-driven underline */}
                            <div 
                                className="absolute bottom-0 left-0 h-[2px] bg-[var(--color-accent)] transition-all duration-150"
                                style={{ 
                                    width: inputWidth > 0 ? `${Math.min((inputWidth / (inputRef.current?.clientWidth || 600)) * 100, 100)}%` : '0%',
                                    opacity: inputWidth > 0 ? 0.6 : 0,
                                }}
                            />
                            <button 
                                onClick={closeSearch}
                                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </button>
                        </div>

                        {/* Results */}
                        <div>
                            {isLoading ? (
                                <div className="text-center py-12 text-[var(--color-secondary)] animate-pulse font-sans text-sm tracking-wide uppercase">
                                    加载索引中...
                                </div>
                            ) : query.length > 0 && results.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 border border-[var(--color-border)] rotate-45 opacity-30" />
                                    <p className="text-[var(--color-secondary)] font-sans text-sm tracking-wide">
                                        未找到与 "{query}" 相关的文章
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-0 divide-y divide-[var(--color-border)]">
                                    {results.map((post, i) => (
                                        <a
                                            key={post.slug}
                                            href={`${baseUrl}blog/${post.slug}`}
                                            className={`group flex items-start gap-5 py-4 transition-all duration-200 relative ${
                                                selectedIndex === i 
                                                    ? 'pl-4' 
                                                    : 'pl-0 hover:pl-4'
                                            }`}
                                            onMouseEnter={() => setSelectedIndex(i)}
                                            style={{
                                                animation: `fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 60 + 100}ms both`,
                                            }}
                                        >
                                            {/* Selection indicator line */}
                                            <div 
                                                className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--color-accent)] transition-transform duration-300 origin-top"
                                                style={{ transform: selectedIndex === i ? 'scaleY(1)' : 'scaleY(0)' }}
                                            />
                                            {/* Index number */}
                                            <span className="text-xs font-sans text-[var(--color-accent)] opacity-50 pt-1 w-6 shrink-0 text-right">
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-base font-display font-bold text-[var(--color-primary)] mb-1 truncate group-hover:text-[var(--color-accent)] transition-colors">
                                                    {post.title}
                                                </h4>
                                                <p className="text-sm text-[var(--color-secondary)] line-clamp-1 opacity-70 font-serif">
                                                    {post.description}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 shrink-0">
                                                <span className="tag-elegant text-[10px]">{post.category}</span>
                                                <time className="text-xs text-[var(--color-secondary)] opacity-50 font-sans">
                                                    {new Date(post.pubDate).toLocaleDateString('en-us', { month: 'short', day: 'numeric' })}
                                                </time>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer hints */}
                        <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex justify-between items-center text-xs text-[var(--color-secondary)] opacity-40 font-sans">
                            <span className="uppercase tracking-widest">{posts.length} 篇文章编入索引</span>
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 border border-[var(--color-border)] text-[10px]">↑↓</kbd>
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 border border-[var(--color-border)] text-[10px]">↵</kbd>
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 border border-[var(--color-border)] text-[10px]">esc</kbd>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
