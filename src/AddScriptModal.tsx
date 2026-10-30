import { useState } from 'react';
import { GameScript, CATEGORIES } from './types';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

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
      id: generateId(),
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-6"
        style={{ backgroundColor: '#1a1a2e', border: '1px solid #2d2d4a', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(108,92,231,0.2)' }}>
              <svg className="w-5 h-5" style={{ color: '#6c5ce7' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Add New Script</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: '#16162a' }}
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  Place ID
                </span>
              </label>
              <input
                type="text"
                value={placeId}
                onChange={(e) => setPlaceId(e.target.value)}
                placeholder="e.g. 2753915589"
                className="w-full px-3 py-2.5 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all"
                style={{ backgroundColor: '#16162a', border: '1px solid #2d2d4a' }}
              />
              {errors.placeId && <p className="text-xs mt-1" style={{ color: '#e17055' }}>{errors.placeId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Game Name</label>
              <input
                type="text"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="e.g. Blox Fruits"
                className="w-full px-3 py-2.5 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all"
                style={{ backgroundColor: '#16162a', border: '1px solid #2d2d4a' }}
              />
              {errors.gameName && <p className="text-xs mt-1" style={{ color: '#e17055' }}>{errors.gameName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-white focus:outline-none transition-all"
                style={{ backgroundColor: '#16162a', border: '1px solid #2d2d4a' }}
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
                className="w-full px-3 py-2.5 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all"
                style={{ backgroundColor: '#16162a', border: '1px solid #2d2d4a' }}
              />
              {errors.author && <p className="text-xs mt-1" style={{ color: '#e17055' }}>{errors.author}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Loadstring Script
              </span>
            </label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder='loadstring(game:HttpGet("https://example.com/script.lua"))()'
              rows={4}
              className="w-full px-3 py-2.5 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all resize-none"
              style={{ backgroundColor: '#16162a', border: '1px solid #2d2d4a', fontFamily: "'Fira Code', monospace", fontSize: '0.8rem' }}
            />
            {errors.script && <p className="text-xs mt-1" style={{ color: '#e17055' }}>{errors.script}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-gray-300 font-medium transition-colors"
              style={{ backgroundColor: '#16162a', border: '1px solid #2d2d4a' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-colors"
              style={{ backgroundColor: '#6c5ce7' }}
            >
              Add Script
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
