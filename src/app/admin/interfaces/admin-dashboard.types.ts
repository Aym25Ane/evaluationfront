// src/app/admin/interfaces/admin-dashboard.types.ts

export interface FormationDashboardSummary {
  id: number;
  titre: string;
  image: string;
  categorieName: string;
  prix: number;
  publier: boolean;
  derniereMiseAJour: string | Date;

  // KPIs (Indicateurs clés)
  nbInscrits: number;
  noteMoyenne: number;
  tauxCompletion: number;
  chiffreAffaires: number;
}

export interface GlobalStats {
  totalEtudiants: number;
  totalRevenus: number;
  formationsActives: number;
  noteGlobale: number;
}
