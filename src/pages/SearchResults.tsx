import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  author: string;
}

interface Profile {
  id: string;
  username: string;
  bio: string;
  avatar_url: string;
}

interface SearchResult {
  id: string;
  type: 'gallery' | 'user';
  title: string;
  description: string;
  image: string;
  url: string;
  author: string;
  date: string;
}

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setResults([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Gallery search with typo tolerance
        const { data: galleryData, error: galleryError } = await supabase
          .from('gallery')
          .select('id, title, description, image_url, created_at, author')
          .or(
            `title.ilike.%${query}%,description.ilike.%${query}%,author.ilike.%${query}%`
          );

        if (galleryError) throw galleryError;

        const galleryResults: SearchResult[] = (galleryData || []).map(item => ({
          id: item.id,
          type: 'gallery',
          title: item.title || 'Untitled Gallery Item',
          description: item.description || 'No description available',
          image: item.image_url || '/assets/placeholder.svg',
          url: `/gallery/${item.id}`,
          author: item.author || 'Unknown',
          date: item.created_at
            ? new Date(item.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            : 'Unknown Date',
        }));

        // Profile search with typo tolerance
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, bio, avatar_url')
          .or(`username.ilike.%${query}%,bio.ilike.%${query}%`);

        if (profilesError) throw profilesError;

        const userResults: SearchResult[] = (profilesData || []).map(user => ({
          id: user.id,
          type: 'user',
          title: user.username,
          description: user.bio || 'No bio available',
          image: user.avatar_url || '/assets/default-avatar.svg',
          url: `/profile/${user.id}`,
          author: user.username,
          date: 'Joined Recently',
        }));

        const allResults = [...galleryResults, ...userResults].sort((a, b) =>
          a.type.localeCompare(b.type)
        );

        setResults(allResults);
      } catch (error) {
        console.error('Search error:', error);
        setError('Failed to fetch search results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const debouncedSearch = debounce(fetchSearchResults, 300);
    debouncedSearch();

    return () => {
      clearTimeout(debouncedSearch as unknown as NodeJS.Timeout);
    };
  }, [query]);

  return (
    <div className="min-h-screen bg-dark-100 text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-3xl font-bold mb-2">
          Search Results for <span className="text-cyan-400">"{query || '...'}"</span>
        </h1>
        <p className="text-gray-400 mb-6">
          Explore our showcase of glass and steel projects, profiles, and more.
        </p>

        {error && (
          <div className="text-center py-20 text-red-400">
            <p>{error}</p>
          </div>
        )}

        {loading && !error ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        ) : results.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="bg-dark-200 rounded-lg overflow-hidden"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <span className="text-sm text-cyan-400 uppercase">
                      {item.type}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    By {item.author} • {item.date}
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <Link
                      to="/contact"
                      className="bg-cyan-500 text-dark-100 px-4 py-2 rounded-full text-sm font-semibold hover:bg-cyan-600 transition"
                      aria-label={`Contact for ${item.title}`}
                    >
                      Contact Now
                    </Link>
                    <Link
                      to={item.url}
                      className="border border-cyan-500 text-cyan-500 px-4 py-2 rounded-full text-sm font-semibold hover:bg-cyan-500 hover:text-dark-100 transition"
                      aria-label={`Visit ${item.title}`}
                    >
                      Visit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">No results found for "{query}"</p>
            <p className="mt-2 text-gray-500">Try different keywords or browse our content.</p>
            <div className="mt-4 space-x-4">
              <Link to="/gallery" className="text-cyan-400 hover:underline">
                Browse Gallery
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
