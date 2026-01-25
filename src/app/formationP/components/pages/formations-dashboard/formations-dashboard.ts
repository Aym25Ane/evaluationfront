import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Import ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormationService } from '../../../services/formation.service';
import { Formation } from '../../../interfaces/formation';
import { FormationSelectionStateService } from '../../../services/formation-selection-state-service';
import { FormationViewComponent } from '../../formation-view/formation-view';

@Component({
  selector: 'app-formations-dashboard',
  standalone: true,
  imports: [CommonModule, FormationViewComponent],
  templateUrl: './formations-dashboard.html',
  styleUrls: ['./formations-dashboard.css']
})
export class FormationsDashboardComponent implements OnInit {

  formations: Formation[] = [];
  loading = true;
  selectedFormation: Formation | null = null;
  showFormationView = false;

  constructor(
    private fs: FormationService,
    private router: Router,
    private formationSelectionStateService: FormationSelectionStateService,
    private cdr: ChangeDetectorRef // 2. Injection du service de détection
  ) {}

  ngOnInit(): void {
    this.fs.getFormations().subscribe({
      next: f => {
        this.formations = f;
        this.loading = false;
        // 3. Forcer la mise à jour de la vue ici
        this.cdr.detectChanges();
      },
      error: e => {
        console.error("Erreur récupération formations", e);
        this.loading = false;
        this.cdr.detectChanges(); // Important en cas d'erreur aussi (pour arrêter le loading spinner)
      }
    });
  }

  edit(id: number) {
    let selectedFromation = this.formations.find(f => f.id === id);

    if (selectedFromation !== undefined)
      this.formationSelectionStateService.setSelectedFormation(selectedFromation);
    else
      return;

    this.router.navigate(['/create_formation']);
  }

  create() {
    this.router.navigate(['/create_formation']);
  }

  delete(id: number) {
    if (!confirm("Supprimer cette formation ?")) return;
    this.fs.deleteFormation(id).subscribe({
      next: () => {
        // On crée une nouvelle référence de tableau pour aider Angular à voir le changement
        this.formations = this.formations.filter(f => f.id !== id);

        // 4. Forcer la mise à jour après suppression
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error("Erreur suppression formation", e);
      }
    });
  }

  viewFormation(f: Formation) {
    console.log(f.titre);
    this.selectedFormation = f;
    this.showFormationView = true;
    // Pas forcément besoin ici car le clic est un événement utilisateur qui déclenche déjà la détection
  }
}
