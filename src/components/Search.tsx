import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { navigate } from 'astro:transitions/client';
import { formatDate } from '../utils/date';

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
  const [loadFailed, setLoadFailed] = useState(false);
  const [isMac, setIsMac] = useState(true);

  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isLoadingRef = useRef(false);

  const baseUrl = import.meta.env.BASE_URL;

  useEffect(() => {
    setIsMac(/mac|iphone|ipad/i.test(navigator.userAgent));
  }, []);

  const loadPosts = useCallback(async () => {
    if (posts.length > 0 || isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsLoading(true);
    setLoadFailed(false);
    try {
      const res = await fetch(`${baseUrl}search.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setPosts(await res.json());
    } catch (error) {
      console.error('Failed to load search index', error);
      setLoadFailed(true);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [baseUrl, posts.length]);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setSelectedIndex(-1);
    requestAnimationFrame(() => {
      if (triggerRef.current && document.contains(triggerRef.current)) {
        triggerRef.current.focus();
      }
    });
  }, []);

  const openSearch = useCallback(() => {
    setIsOpen(true);
    void loadPosts();
  }, [loadPosts]);

  // ⌘K / Ctrl+K
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (isOpen) closeSearch();
        else openSearch();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, openSearch, closeSearch]);

  // Scroll lock + initial focus (only when the dialog opens)
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Dialog keyboard handling and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeSearch();
        return;
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        if (results.length === 0) return;
        event.preventDefault();
        setSelectedIndex((prev) => {
          if (event.key === 'ArrowDown') return prev >= results.length - 1 ? 0 : prev + 1;
          return prev <= 0 ? results.length - 1 : prev - 1;
        });
        return;
      }

      if (event.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
        event.preventDefault();
        void navigate(`${baseUrl}blog/${results[selectedIndex].slug}`);
        closeSearch();
        return;
      }

      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, results, selectedIndex, closeSearch, baseUrl]);

  // Filter
  useEffect(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(keyword) ||
        post.description.toLowerCase().includes(keyword),
    );
    setResults(filtered.slice(0, 8));
    setSelectedIndex(-1);
  }, [query, posts]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openSearch}
        className="group flex items-center gap-2 px-3 py-1.5 border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors duration-300 text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
        aria-label="搜索文章"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="search-dialog"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-xs font-sans font-semibold tracking-wide uppercase hidden md:inline">Search</span>
        <kbd className="hidden md:inline-flex items-center px-1 py-0.5 text-[10px] font-sans bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-[var(--color-secondary)]">
          {isMac ? '⌘K' : 'Ctrl K'}
        </kbd>
      </button>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex flex-col">
            <div
              className="absolute inset-0"
              style={{ backgroundColor: 'var(--color-background)' }}
              onClick={closeSearch}
              aria-hidden="true"
            />

          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="搜索文章"
            id="search-dialog"
            className="relative flex min-h-[100dvh] w-full max-w-3xl mx-auto flex-col px-5 md:px-10 pt-20 md:pt-28 pb-8 max-h-[100dvh] overflow-y-auto"
            style={{ animation: 'fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both' }}
          >
            <div className="mb-10 overflow-hidden">
              <h2 className="text-sm font-sans font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)] animate-fade-in-up">
                Index
              </h2>
              <div className="golden-line mt-4"></div>
            </div>

            <div className="relative mb-8">
              <input
                ref={inputRef}
                type="text"
                aria-label="搜索关键词"
                placeholder="搜索文章…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full h-14 pl-0 pr-12 bg-transparent border-0 border-b-2 border-[var(--color-border)] text-2xl md:text-3xl text-[var(--color-text)] placeholder-[var(--color-secondary)]/50 focus:outline-none focus:border-[var(--color-accent)] transition-colors font-display tracking-tight"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={closeSearch}
                aria-label="关闭搜索"
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>

            <div aria-live="polite" className="flex-1">
              {isLoading ? (
                <div className="text-center py-12 text-[var(--color-secondary)] animate-pulse font-sans text-sm tracking-wide uppercase">
                  加载索引中…
                </div>
              ) : loadFailed ? (
                <div className="text-center py-12 text-[var(--color-secondary)] font-sans text-sm tracking-wide">
                  搜索索引加载失败，请稍后再试。
                </div>
              ) : query.trim().length > 0 && results.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 border border-[var(--color-border)] rotate-45 opacity-30" aria-hidden="true" />
                  <p className="text-[var(--color-secondary)] font-sans text-sm tracking-wide">
                    未找到与「{query.trim()}」相关的文章
                  </p>
                </div>
              ) : results.length > 0 ? (
                <ul className="divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
                  {results.map((post, index) => (
                    <li key={post.slug}>
                      <a
                        href={`${baseUrl}blog/${post.slug}`}
                        onClick={closeSearch}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`group flex items-start gap-5 py-4 transition-colors duration-200 relative ${
                          selectedIndex === index ? 'pl-4 bg-[var(--color-surface)]/50' : 'pl-0'
                        }`}
                        style={{ animation: `fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${index * 50 + 80}ms both` }}
                      >
                        <span
                          className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--color-accent)] transition-transform duration-300 origin-top"
                          style={{ transform: selectedIndex === index ? 'scaleY(1)' : 'scaleY(0)' }}
                          aria-hidden="true"
                        />
                        <span className="text-xs font-sans text-[var(--color-accent)] opacity-70 pt-1 w-6 shrink-0 text-right">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-display font-bold text-[var(--color-primary)] mb-1 truncate group-hover:text-[var(--color-accent)] transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-sm text-[var(--color-secondary)] line-clamp-1 font-serif">
                            {post.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="tag-elegant text-[10px]">{post.category}</span>
                          <time className="text-xs text-[var(--color-secondary)] opacity-70 font-sans">
                            {formatDate(new Date(post.pubDate), { month: 'short' })}
                          </time>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center py-12 text-sm text-[var(--color-secondary)] font-sans tracking-wide">
                  输入标题或摘要中的关键词开始搜索
                </p>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-[var(--color-border)] flex flex-wrap justify-between gap-3 items-center text-xs text-[var(--color-secondary)] font-sans">
              <span className="uppercase tracking-widest">{posts.length} 篇文章编入索引</span>
              <div className="flex gap-4" aria-hidden="true">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 border border-[var(--color-border)] text-[10px]">↑↓</kbd>
                  选择
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 border border-[var(--color-border)] text-[10px]">↵</kbd>
                  打开
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 border border-[var(--color-border)] text-[10px]">esc</kbd>
                  关闭
                </span>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
