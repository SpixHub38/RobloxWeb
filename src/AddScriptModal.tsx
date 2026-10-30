import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X, Code2, Gamepad2 } from 'lucide-react';
import { GameScript, CATEGORIES, Category } from './types';
import { v4 as uuidv4 } from 'uuid';

interface AddScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (script: GameScript) => void;
}

export default function AddScriptModal({ isOpen, onClose, onAdd }: AddScriptModalProps) {
  const [placeId, setPlaceId] = useState('');
  const [gameName, setGameName] = useState('');
  const [script, setScript] = useState('');
  const [category, setCategory] = useState<string>('Other');
  const [author, setAuthor] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!placeId.trim()) newErrors.placeId = 'Place ID is required';
    else if (!/^\d+$/.test(placeId.trim())) newErrors.placeId = 'Place ID must be a number';
    if (!gameName.trim()) newErrors.gameName = 'Game name is required';
    if (!script.trim()) newErrors.script = 'Script is required';
    if (!author.trim()) newErrors.author = 'Author name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newScript: GameScript = {
      id: uuidv4(),
      placeId: placeId.trim(),
      gameName: gameName.trim(),
      script: script.trim(),
      category,
      author: author.trim(),
      createdAt: Date.now(),
      copies: 0,
    };

    onAdd(newScript);
    setPlaceId('');
    setGameName('');
    setScript('');
    setCategory('Other');
    setAuthor('');
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-lg bg-dark-card border border-dark-border rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-white">Add New Script</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-dark-input flex items-center justify-center hover:bg-dark-border transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Gamepad2 className="w-3.5 h-3.5" /> Place ID
                    </span>
                  </label>
                  <input
                    type="text"
                    value={placeId}
                    onChange={(e) => setPlaceId(e.target.value)}
                    placeholder="e.g. 2753915589"
                    className="w-full px-3 py-2.5 bg-dark-input border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                  {errors.placeId && <p className="text-xs text-danger mt-1">{errors.placeId}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Game Name</label>
                  <input
                    type="text"
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    placeholder="e.g. Blox Fruits"
                    className="w-full px-3 py-2.5 bg-dark-input border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                  {errors.gameName && <p className="text-xs text-danger mt-1">{errors.gameName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-dark-input border border-dark-border rounded-xl text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. ScriptMaster"
                    className="w-full px-3 py-2.5 bg-dark-input border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                  {errors.author && <p className="text-xs text-danger mt-1">{errors.author}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5" /> Loadstring Script
                  </span>
                </label>
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder='loadstring(game:HttpGet("https://example.com/script.lua"))()'
                  rows={4}
                  className="w-full px-3 py-2.5 bg-dark-input border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm resize-none"
                />
                {errors.script && <p className="text-xs text-danger mt-1">{errors.script}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-dark-input border border-dark-border rounded-xl text-gray-300 hover:bg-dark-border transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-dark rounded-xl text-white font-medium transition-colors shadow-lg shadow-primary/25"
                >
                  Add Script
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
