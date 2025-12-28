import {Component, Input, computed, signal, inject, Provider} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {Chapitre, Formation} from '../../interfaces/formation';


@Component({
  selector: 'app-formation-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formation-view.html',
  styleUrls: ['./formation-view.css']
})
export class FormationViewComponent {
  // Signal pour la formation
  protected formationSignal = signal<Formation | null>(null);
  openChapters = signal<Record<number, boolean>>({});
  @Input()
  set formation(value: Formation|null|undefined) {
    if(value){
      this.formationSignal.set(value);
      const state: Record<number, boolean> = {};
      value.cours?.forEach(c => c.chapitres?.forEach(ch => { if (ch.id) state[ch.id] = false; }));
      this.openChapters.set(state);
    }
  }

  // CORRECTION: Rendre la formation accessible dans le template via un nom unique (par exemple, formationComputed)
  // Utilisation de 'protected' pour qu'il soit accessible dans le template
  protected formationComputed = computed(() => this.formationSignal());

  toggleChapter(chapitre: Chapitre) {
    if (!chapitre.id) return;
    const current = this.openChapters();
    current[chapitre.id] = !current[chapitre.id];
    this.openChapters.set({ ...current });
  }

  isChapterOpen(chapitre: Chapitre): boolean {
    return chapitre.id ? !!this.openChapters()[chapitre.id] : false;
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) {
      return 'N/A';
    }
    // CORRECTION : On retourne la date formatée, pas "N/A"
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
