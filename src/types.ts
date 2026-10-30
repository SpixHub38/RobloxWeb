export interface GameScript {
  id: string;
  placeId: string;
  gameName: string;
  script: string;
  category: string;
  author: string;
  createdAt: number;
  copies: number;
}

export type Category = 'All' | 'Combat' | 'Farming' | 'Tycoon' | 'Simulator' | 'Roleplay' | 'Horror' | 'Other';

export const CATEGORIES: Category[] = ['All', 'Combat', 'Farming', 'Tycoon', 'Simulator', 'Roleplay', 'Horror', 'Other'];
