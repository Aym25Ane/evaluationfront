import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Imports Services et Interfaces
import { FormationService } from '../services/formation.service';
import { FormationDashboardSummary, GlobalStats } from '../interfaces/admin-dashboard.types';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe, DecimalPipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  private formationService = inject(FormationService);
  private router = inject(Router);

  // --- SIGNALS (État) ---
  formations = signal<FormationDashboardSummary[]>([]);
  isLoading = signal<boolean>(true);

  // Filtres
  searchQuery = signal<string>('');
  filterStatus = signal<'TOUS' | 'PUBLIE' | 'BROUILLON'>('TOUS');

  // --- SIGNALS CALCULÉS (Logique) ---

  // 1. Calcul des Stats Globales (Haut de page)
  globalStats = computed<GlobalStats>(() => {
    const list = this.formations();
    const totalEtudiants = list.reduce((acc, f) => acc + f.nbInscrits, 0);
    const totalRevenus = list.reduce((acc, f) => acc + f.chiffreAffaires, 0);
    const formationsActives = list.filter(f => f.publier).length;

    const sumNotes = list.reduce((acc, f) => acc + f.noteMoyenne, 0);
    const noteGlobale = list.length > 0 ? sumNotes / list.length : 0;

    return { totalEtudiants, totalRevenus, formationsActives, noteGlobale };
  });

  // 2. Liste Filtrée (Tableau)
  filteredFormations = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const status = this.filterStatus();

    return this.formations().filter(f => {
      const matchSearch = f.titre.toLowerCase().includes(query) ||
        f.categorieName.toLowerCase().includes(query);

      const matchStatus = status === 'TOUS'
        || (status === 'PUBLIE' && f.publier)
        || (status === 'BROUILLON' && !f.publier);

      return matchSearch && matchStatus;
    });
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.formationService.getAdminDashboardStats().subscribe({
      next: (data) => {
        this.formations.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur dashboard', err);
        this.isLoading.set(false);
      }
    });
  }

  // --- ACTIONS ---

  togglePublish(f: FormationDashboardSummary): void {
    // Optimistic UI : Mise à jour immédiate
    this.formations.update(list => list.map(item =>
      item.id === f.id ? { ...item, publier: !item.publier } : item
    ));

    this.formationService.togglePublication(f.id, f.publier).subscribe({
      error: () => {
        // Rollback en cas d'erreur
        this.formations.update(list => list.map(item =>
          item.id === f.id ? { ...item, publier: !item.publier } : item
        ));
        alert("Erreur lors de la modification du statut.");
      }
    });
  }

  deleteFormation(f: FormationDashboardSummary): void {
    if(confirm(`Supprimer définitivement "${f.titre}" ?`)) {
      this.formationService.deleteFormation(f.id).subscribe({
        next: () => {
          this.formations.update(list => list.filter(item => item.id !== f.id));
        }
      });
    }
  }

  editFormation(id: number): void {
    // Redirection vers votre composant d'édition existant
    this.router.navigate(['/create_formation'], { queryParams: { id: id } });
    // Note: Adaptez la route si vous utilisez un système d'ID dans l'URL (ex: /edit/5)
  }

  // Remplacement de la méthode getCategoryColor
  getCategoryColor(catName: string): string {
    if (!catName) return 'bg-slate-100 text-slate-700';
    const first = catName.charAt(0).toLowerCase();
    if (['a','b','c','d'].includes(first))
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    if (['e','f','g','h','i'].includes(first))
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    if (['j','k','l','m','n'].includes(first))
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    return 'bg-violet-50 text-violet-700 border border-violet-200';
  }
}
