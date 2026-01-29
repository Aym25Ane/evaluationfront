import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
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

  private fs = inject(FormationService);
  private router = inject(Router);
  private formationSelectionStateService = inject(FormationSelectionStateService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations() {
    this.loading = true;
    this.fs.getFormations().subscribe({
      next: (f) => {
        this.formations = f;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error("Erreur API", e);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  create() {
    this.formationSelectionStateService.setSelectedFormation(null); // Reset selection
    this.router.navigate(['/create_formation']);
  }

  edit(id: number) {
    const selected = this.formations.find(f => f.id === id);
    if (selected) {
      this.formationSelectionStateService.setSelectedFormation(selected);
      this.router.navigate(['/create_formation']);
    }
  }

  delete(id: number) {
    if (!confirm("Voulez-vous vraiment supprimer cette formation ? Cette action est irréversible.")) return;

    this.fs.deleteFormation(id).subscribe({
      next: () => {
        this.formations = this.formations.filter(f => f.id !== id);
        this.cdr.detectChanges();
      },
      error: (e) => console.error(e)
    });
  }

  viewFormation(f: Formation) {
    this.selectedFormation = f;
    this.showFormationView = true;
  }

  closeModal() {
    this.showFormationView = false;
    this.selectedFormation = null;
  }
}
