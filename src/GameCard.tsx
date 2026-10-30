import { useState } from 'react';
import { GameScript } from './types';
import { copyToClipboard } from './utils';

interface GameCardProps {
  script: GameScript;
  onDelete: (id: string) => void;
  onCopy: (id: string) => void;
  index: number;
}

export default function GameCard({ script, onDelete, onCopy }: GameCardProps) {
  const [copied, setCopied] = useState(false);
  const [showFullScript, setShowFullScript] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(script.script);
    setCopied(true);
    onCopy(script.id);
    setTimeout(() => setCopied(false), 2000);
  };

  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    Combat: { bg: 'rgba(239,68,68,0.2)', text: '#f87171', border: 'rgba(239,68,68,0.3)' },
    Farming: { bg: 'rgba(34,197,94,0.2)', text: '#4ade80', border: 'rgba(34,197,94,0.3)' },
    Tycoon: { bg: 'rgba(234,179,8,0.2)', text: '#facc15', border: 'rgba(234,179,8,0.3)' },
    Simulator: { bg: 'rgba(59,130,246,0.2)', text: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
    Roleplay: { bg: 'rgba(236,72,153,0.2)', text: '#f472b6', border: 'rgba(236,72,153,0.3)' },
    Horror: { bg: 'rgba(168,85,247,0.2)', text: '#c084fc', border: 'rgba(168,85,247,0.3)' },
    Other: { bg: 'rgba(156,163,175,0.2)', text: '#9ca3af', border: 'rgba(156,163,175,0.3)' },
  };

  const colors = categoryColors[script.category] || categoryColors.Other;

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
    <div
      className="group rounded-2xl overflow-hidden transition-all duration-300"
      style={{ backgroundColor: '#1a1a2e', border: '1px solid #2d2d4a' }}
    >
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">
              {script.gameName}
            </h3>
            <div className="flex items-center gap-3 mt-1.5">
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
                style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
              >
                {script.category}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {timeAgo(script.createdAt)}
              </span>
            </div>
          </div>
          <button
            onClick={() => onDelete(script.id)}
            className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ color: '#9ca3af' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(225,112,85,0.2)'; e.currentTarget.style.color = '#e17055'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#9ca3af'; }}
            title="Delete script"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Place ID */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-400">Place ID:</span>
          <a
            href={`https://www.roblox.com/games/${script.placeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs flex items-center gap-1 transition-colors"
            style={{ color: '#00cec9' }}
          >
            {script.placeId}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Script Code */}
        <div className="relative">
          <div className="rounded-xl p-3 overflow-hidden" style={{ backgroundColor: '#16162a', border: '1px solid #2d2d4a' }}>
            <pre
              className="text-gray-300 whitespace-pre-wrap break-all text-xs leading-relaxed"
              style={{
                fontFamily: "'Fira Code', 'JetBrains Mono', 'Courier New', monospace",
                maxHeight: showFullScript ? 'none' : '4.8em',
                overflow: 'hidden'
              }}
            >
              {script.script}
            </pre>
            {script.script.length > 120 && (
              <button
                onClick={() => setShowFullScript(!showFullScript)}
                className="text-xs mt-2 transition-colors"
                style={{ color: '#6c5ce7' }}
              >
                {showFullScript ? 'Show less' : 'Show more...'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: 'rgba(22,22,42,0.5)', borderTop: '1px solid #2d2d4a' }}>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{script.author}</span>
          <span className="mx-1">•</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>{script.copies.toLocaleString()} copies</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={copied
            ? { backgroundColor: 'rgba(0,184,148,0.2)', color: '#00b894', border: '1px solid rgba(0,184,148,0.3)' }
            : { backgroundColor: '#6c5ce7', color: '#fff', border: 'none' }
          }
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Script
            </>
          )}
        </button>
      </div>
    </div>
  );
}
