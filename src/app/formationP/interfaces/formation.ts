// src/app/interfaces/formation.ts

// =====================
// CATEGORIE
// =====================
export interface Categorie {
  id?: number;
  name: string;
  description?: string;
}

// =====================
// SECTION
// =====================
export type TypeContenu = 'TEXTE' | 'IMAGE' | 'VIDEO';

export interface Section {
  id?: number;
  titre: string;
  typeContenu: TypeContenu;
  contenu: string;
}

// =====================
// CHAPITRE
// =====================
export interface Chapitre {
  id?: number;
  titre: string;
  sections: Section[];
}

// =====================
// COURS
// =====================
export interface Cours {
  id?: number;
  titre: string;
  resume?: string;
  chapitres: Chapitre[];
}

// =====================
// FORMATION
// =====================
export interface Formation {
  id?: number;
  titre: string;
  description?: string;
  niveau?: string;
  image?: string;

  // Date envoyée généralement comme string depuis le backend
  derniereMiseAJour: string | Date;

  prix: number;
  publier: boolean;

  categorie?: Categorie;
  cours: Cours[];
}

// =====================
// TYPE GENERIQUE
// =====================
export type ContentItem =
  | Formation
  | Cours
  | Chapitre
  | Section;
