// src/app/interfaces/formation.ts

export interface Section {
  id?: number;
  titre: string;
  typeContenu: 'TEXTE' | 'VIDEO' | 'IMAGE';
  contenu: string;
}

export interface Chapitre {
  id?: number;
  titre: string;
  sections?: Section[];
}

export interface Cours {
  id?: number;
  titre: string;
  resume?: string;
  chapitres?: Chapitre[];
}

export interface Formation {
  id?: number;
  derniereMiseAJour:Date;
  titre: string;
  description?: string;
  niveau?: string;
  image?: string;
  cours?: Cours[];
}

export type ContentItem = Formation | Cours | Chapitre | Section;
