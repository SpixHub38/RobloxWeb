import { useState, useEffect, useMemo } from 'react';
import { GameScript, CATEGORIES, Category } from './types';
import { loadScripts, saveScripts } from './utils';
import GameCard from './GameCard';
import AddScriptModal from './AddScriptModal';

export default function App() {
  const [scripts, setScripts] = useState<GameScript[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');

  useEffect(() => {
    const loaded = loadScripts();
    setScripts(loaded);
  }, []);

  useEffect(() => {
    if (scripts.length > 0) {
      saveScripts(scripts);
    }
  }, [scripts]);

  const filteredScripts = useMemo(() => {
    let result = [...scripts];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.gameName.toLowerCase().includes(query) ||
          s.placeId.includes(query) ||
          s.author.toLowerCase().includes(query) ||
          s.script.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter((s) => s.category === selectedCategory);
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => b.createdAt - a.createdAt);
    } else {
      result.sort((a, b) => b.copies - a.copies);
    }

    return result;
  }, [scripts, searchQuery, selectedCategory, sortBy]);

  const handleAddScript = (newScript: GameScript) => {
    setScripts((prev) => [newScript, ...prev]);
  };

  const handleDeleteScript = (id: string) => {
    setScripts((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCopy = (id: string) => {
    setScripts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, copies: s.copies + 1 } : s))
    );
  };

  const totalCopies = scripts.reduce((sum, s) => sum + s.copies, 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f1a' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b" style={{ backgroundColor: 'rgba(15,15,26,0.9)', borderColor: '#2d2d4a', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6c5ce7, #00cec9)' }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Ro<span style={{ color: '#6c5ce7' }}>Scripts</span>
                </h1>
                <p className="text-xs text-gray-500 -mt-0.5 hidden sm:block">Roblox Script Hub</p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-colors"
              style={{ backgroundColor: '#6c5ce7' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add Script</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4" style={{ backgroundColor: 'rgba(108,92,231,0.1)', border: '1px solid rgba(108,92,231,0.2)', color: '#6c5ce7' }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Community-Powered Script Hub
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Find & Share Roblox Scripts
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
          Add your favorite game scripts with Place IDs. Share loadstring scripts with the community and let others copy them instantly.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 sm:gap-12 mt-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{scripts.length}</div>
            <div className="text-xs text-gray-500">Scripts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{totalCopies.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Total Copies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{new Set(scripts.map(s => s.author)).size}</div>
            <div className="text-xs text-gray-500">Contributors</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by game name, Place ID, or author..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all text-sm"
              style={{ backgroundColor: '#1a1a2e', border: '1px solid #2d2d4a' }}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('newest')}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: sortBy === 'newest' ? 'rgba(108,92,231,0.2)' : '#1a1a2e',
                color: sortBy === 'newest' ? '#6c5ce7' : '#9ca3af',
                border: `1px solid ${sortBy === 'newest' ? 'rgba(108,92,231,0.3)' : '#2d2d4a'}`
              }}
            >
              Newest
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: sortBy === 'popular' ? 'rgba(108,92,231,0.2)' : '#1a1a2e',
                color: sortBy === 'popular' ? '#6c5ce7' : '#9ca3af',
                border: `1px solid ${sortBy === 'popular' ? 'rgba(108,92,231,0.3)' : '#2d2d4a'}`
              }}
            >
              Most Copied
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
              style={{
                backgroundColor: selectedCategory === cat ? '#6c5ce7' : '#1a1a2e',
                color: selectedCategory === cat ? '#fff' : '#9ca3af',
                border: selectedCategory === cat ? 'none' : '1px solid #2d2d4a'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scripts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredScripts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#1a1a2e', border: '1px solid #2d2d4a' }}>
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-400 mb-2">No scripts found</h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search or filters'
                : 'Be the first to add a script!'}
            </p>
            {!searchQuery && selectedCategory === 'All' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-colors"
                style={{ backgroundColor: '#6c5ce7' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add First Script
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScripts.map((script, index) => (
              <GameCard
                key={script.id}
                script={script}
                onDelete={handleDeleteScript}
                onCopy={handleCopy}
                index={index}
              />
            ))}
          </div>
        )}

        {filteredScripts.length > 0 && (
          <div className="text-center mt-8 text-sm text-gray-500">
            Showing {filteredScripts.length} of {scripts.length} scripts
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t py-6" style={{ borderColor: '#2d2d4a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-gray-500">
            RoScripts — Community Roblox Script Hub • Scripts are user-submitted and not affiliated with Roblox Corporation
          </p>
        </div>
      </footer>

      {/* Modal */}
      <AddScriptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddScript}
      />
    </div>
  );
}
