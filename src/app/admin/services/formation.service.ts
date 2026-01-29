import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

// Import depuis le dossier ADMIN
import { FormationDashboardSummary } from '../../admin/interfaces/admin-dashboard.types';
import {Formation} from '../../formationP/interfaces/formation';


@Injectable({ providedIn: 'root' })
export class FormationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiBaseUrl;

  /**
   * Récupère les données formatées pour le Dashboard Admin.
   * Si le backend n'a pas encore l'endpoint spécifique /dashboard,
   * on peut mapper la liste standard ici.
   */
  getAdminDashboardStats(): Observable<FormationDashboardSummary[]> {
    // Option A: Si le backend a un endpoint dédié (Recommandé)
    // return this.http.get<FormationDashboardSummary[]>(`${this.apiUrl}/formations/dashboard`);

    // Option B: Mapping temporaire depuis les formations standard (Pour que ça marche tout de suite)
    return this.http.get<Formation[]>(`${this.apiUrl}/formations`).pipe(
      map(formations => formations.map(f => ({
        id: f.id!,
        titre: f.titre,
        image: f.image || '',
        categorieName: f.categorie ? f.categorie.name : 'Non classé',
        prix: f.prix,
        publier: f.publier,
        derniereMiseAJour: f.derniereMiseAJour,
        // Simulation des KPIs (car pas encore en BDD)
        nbInscrits: Math.floor(Math.random() * 500),
        noteMoyenne: 3 + Math.random() * 2,
        tauxCompletion: Math.floor(Math.random() * 100),
        chiffreAffaires: f.prix * Math.floor(Math.random() * 100)
      })))
    );
  }

  togglePublication(id: number, statutActuel: boolean): Observable<any> {
    // On envoie l'inverse du statut actuel
    const newFormationPart = { publier: !statutActuel };
    return this.http.put(`${this.apiUrl}/formations/${id}`, newFormationPart);
  }

  deleteFormation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/formations/${id}`);
  }
}
