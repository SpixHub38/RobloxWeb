import { GameScript } from './types';

const STORAGE_KEY = 'roscripts_games';

export function loadScripts(): GameScript[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load scripts from localStorage:', e);
  }
  return getDefaultScripts();
}

export function saveScripts(scripts: GameScript[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts));
  } catch (e) {
    console.error('Failed to save scripts to localStorage:', e);
  }
}

export function getDefaultScripts(): GameScript[] {
  return [
    {
      id: '1',
      placeId: '2753915589',
      gameName: 'Blox Fruits',
      script: 'loadstring(game:HttpGet("https://example.com/bloxfruits.lua"))()',
      category: 'Combat',
      author: 'ScriptMaster',
      createdAt: Date.now() - 86400000 * 3,
      copies: 1247,
    },
    {
      id: '2',
      placeId: '6516141723',
      gameName: 'Pet Simulator X',
      script: 'loadstring(game:HttpGet("https://example.com/petsimx.lua"))()',
      category: 'Simulator',
      author: 'PetLover99',
      createdAt: Date.now() - 86400000 * 2,
      copies: 892,
    },
    {
      id: '3',
      placeId: '1553296229',
      gameName: 'Adopt Me!',
      script: 'loadstring(game:HttpGet("https://example.com/adoptme.lua"))()',
      category: 'Roleplay',
      author: 'TraderPro',
      createdAt: Date.now() - 86400000,
      copies: 2341,
    },
  ];
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  return Promise.resolve();
}
