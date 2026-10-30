import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Code2, Gamepad2, Sparkles, Filter } from 'lucide-react';
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
    setScripts(loadScripts());
  }, []);

  useEffect(() => {
    if (scripts.length > 0) {
      saveScripts(scripts);
    }
  }, [scripts]);

  const filteredScripts = useMemo(() => {
    let result = [...scripts];

    // Filter by search
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

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter((s) => s.category === selectedCategory);
    }

    // Sort
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
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Ro<span className="text-primary">Scripts</span>
                </h1>
                <p className="text-[10px] text-gray-500 -mt-0.5 hidden sm:block">Roblox Script Hub</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark rounded-xl text-white text-sm font-medium transition-colors shadow-lg shadow-primary/25"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Script</span>
              <span className="sm:hidden">Add</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Community-Powered Script Hub
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Find & Share Roblox Scripts
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
              Add your favorite game scripts with Place IDs. Share loadstring scripts with the community and let others copy them instantly.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center gap-6 sm:gap-10 mt-8"
          >
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
          </motion.div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by game name, Place ID, or author..."
              className="w-full pl-10 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm"
            />
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('newest')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                sortBy === 'newest'
                  ? 'bg-primary/20 text-primary border-primary/30'
                  : 'bg-dark-card text-gray-400 border-dark-border hover:border-gray-600'
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                sortBy === 'popular'
                  ? 'bg-primary/20 text-primary border-primary/30'
                  : 'bg-dark-card text-gray-400 border-dark-border hover:border-gray-600'
              }`}
            >
              Most Copied
            </button>
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex items-center gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide"
        >
          <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-dark-card text-gray-400 hover:text-white hover:bg-dark-card-hover border border-dark-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Scripts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <AnimatePresence mode="wait">
          {filteredScripts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-2xl bg-dark-card border border-dark-border flex items-center justify-center mx-auto mb-4">
                <Gamepad2 className="w-8 h-8 text-gray-600" />
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark rounded-xl text-white text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add First Script
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredScripts.map((script, index) => (
                <GameCard
                  key={script.id}
                  script={script}
                  onDelete={handleDeleteScript}
                  onCopy={handleCopy}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        {filteredScripts.length > 0 && (
          <div className="text-center mt-8 text-sm text-gray-500">
            Showing {filteredScripts.length} of {scripts.length} scripts
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-dark-border py-6">
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
