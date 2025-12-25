import React, { useState, useEffect, useRef } from 'react';

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
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Get the base URL from a meta tag or global variable if possible, 
        // but for now we can infer it or hardcode the known base.
        // Since we are in a component, import.meta.env.BASE_URL is available at build time.
        const baseUrl = import.meta.env.BASE_URL;
        
        fetch(`${baseUrl}search.json`)
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(err => console.error("Failed to load search index", err));
            
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const q = e.target.value;
        setQuery(q);
        
        if (q.length > 0) {
            setIsOpen(true);
            const filtered = posts.filter(post => 
                post.title.toLowerCase().includes(q.toLowerCase()) ||
                post.description.toLowerCase().includes(q.toLowerCase())
            );
            setResults(filtered.slice(0, 5)); // Limit to 5 results
        } else {
            setIsOpen(false);
            setResults([]);
        }
    };

    const baseUrl = import.meta.env.BASE_URL;

    return (
        <div className="relative" ref={searchRef}>
            <div className="relative group">
                <input
                    type="text"
                    placeholder="搜索..."
                    value={query}
                    onChange={handleSearch}
                    onFocus={() => query.length > 0 && setIsOpen(true)}
                    className="w-9 md:w-48 focus:w-40 md:focus:w-48 px-4 py-1.5 pl-9 rounded-full bg-transparent md:bg-[var(--color-surface)] focus:bg-[var(--color-surface)] border border-transparent md:border-[var(--color-border)] focus:border-[var(--color-primary)] text-sm focus:outline-none transition-all duration-300 cursor-pointer focus:cursor-text placeholder-transparent focus:placeholder-gray-400 md:placeholder-gray-400"
                />
                <svg 
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-primary)] md:text-[var(--color-secondary)] w-4 h-4 pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg shadow-xl overflow-hidden z-50">
                    {results.map((post) => (
                        <a 
                            key={post.slug} 
                            href={`${baseUrl}blog/${post.slug}`}
                            className="block px-4 py-3 hover:bg-[var(--color-surface)] border-b border-[var(--color-border)] last:border-0 transition-colors"
                        >
                            <h4 className="text-sm font-bold text-[var(--color-primary)] mb-1">{post.title}</h4>
                            <p className="text-xs text-[var(--color-secondary)] line-clamp-1">{post.description}</p>
                        </a>
                    ))}
                </div>
            )}
            
            {isOpen && query.length > 0 && results.length === 0 && (
                 <div className="absolute top-full right-0 mt-2 w-64 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg shadow-xl p-4 text-sm text-[var(--color-secondary)] z-50">
                    未找到相关文章
                </div>
            )}
        </div>
    );
}
