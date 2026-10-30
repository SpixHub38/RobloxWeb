import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink, Trash2, User, Clock, Copy as CopyIcon } from 'lucide-react';
import { GameScript } from './types';
import { copyToClipboard } from './utils';

interface GameCardProps {
  script: GameScript;
  onDelete: (id: string) => void;
  onCopy: (id: string) => void;
  index: number;
}

export default function GameCard({ script, onDelete, onCopy, index }: GameCardProps) {
  const [copied, setCopied] = useState(false);
  const [showFullScript, setShowFullScript] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(script.script);
    setCopied(true);
    onCopy(script.id);
    setTimeout(() => setCopied(false), 2000);
  };

  const categoryColors: Record<string, string> = {
    Combat: 'bg-red-500/20 text-red-400 border-red-500/30',
    Farming: 'bg-green-500/20 text-green-400 border-green-500/30',
    Tycoon: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Simulator: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Roleplay: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    Horror: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    Other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  const timeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
    >
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
              {script.gameName}
            </h3>
            <div className="flex items-center gap-3 mt-1.5">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${categoryColors[script.category] || categoryColors.Other}`}>
                {script.category}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo(script.createdAt)}
              </span>
            </div>
          </div>
          <button
            onClick={() => onDelete(script.id)}
            className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-danger/20 text-gray-500 hover:text-danger transition-all"
            title="Delete script"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Place ID */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-400">Place ID:</span>
          <a
            href={`https://www.roblox.com/games/${script.placeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-secondary hover:text-secondary/80 flex items-center gap-1 transition-colors"
          >
            {script.placeId}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Script Code */}
        <div className="relative">
          <div className="bg-dark-input border border-dark-border rounded-xl p-3 overflow-hidden">
            <pre className={`code-block text-gray-300 whitespace-pre-wrap break-all ${showFullScript ? '' : 'line-clamp-3'}`}>
              {script.script}
            </pre>
            {script.script.length > 150 && (
              <button
                onClick={() => setShowFullScript(!showFullScript)}
                className="text-xs text-primary hover:text-primary-dark mt-2 transition-colors"
              >
                {showFullScript ? 'Show less' : 'Show more...'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-dark-input/50 border-t border-dark-border flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <User className="w-3.5 h-3.5" />
          <span>{script.author}</span>
          <span className="mx-1">•</span>
          <CopyIcon className="w-3.5 h-3.5" />
          <span>{script.copies.toLocaleString()} copies</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            copied
              ? 'bg-success/20 text-success border border-success/30'
              : 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/25'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Script
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
