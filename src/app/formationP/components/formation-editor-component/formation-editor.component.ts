// src/app/components/formation-editor/formation-editor.component.ts

import {
  Component,
  OnInit,
  signal,
  inject,
  WritableSignal,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { StructureExplorerComponent } from '../structure-explorer/structure-explorer.component';
import { FormationService } from '../../services/formation.service';

import { CourseFormComponent } from '../forms/course-form/course-form.component';
import { ChapitreFormComponent } from '../forms/chapitre-form/chapitre-form.component';
import { SectionFormComponent } from '../forms/section-form/section-form.component';
import { FormationFormComponent } from '../forms/formation-form/formation-form-component';

import { FormationSelectionStateService } from '../../services/formation-selection-state-service';
import { Chapitre, ContentItem, Cours, Formation, Section } from '../../interfaces/formation';

@Component({
  selector: 'app-formation-editor',
  standalone: true,
  imports: [
    CommonModule,
    StructureExplorerComponent,
    FormationFormComponent,
    CourseFormComponent,
    ChapitreFormComponent,
    SectionFormComponent
  ],
  templateUrl: './formation-editor.component.html',
  styleUrls: ['./formation-editor.component.css']
})
export class FormationEditorComponent implements OnInit {

  formation!: WritableSignal<Formation>;
  selectedItem = signal<ContentItem | null>(null);

  lastSaved = signal<string | Date | null>(null);
  isSaving = signal(false);
  saveMessage = signal('');

  private formationService = inject(FormationService);

  constructor(
    private formationSelectionStateService: FormationSelectionStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const initialFormation =
      this.formationSelectionStateService.getCurrentFormation()
      ?? this.getInitialData();

    this.formation = signal(initialFormation);
    this.onSelectItem(this.formation());
  }

  onSelectItem(item: ContentItem): void {
    this.selectedItem.set(item);
  }

  onUpdateSelectedItem(updatedItem: ContentItem): void {
    if (this.isFormation(updatedItem)) {
      this.formation.set(updatedItem);
    }
    this.selectedItem.set(updatedItem);
    this.formation.update(f => ({ ...f }));
    this.cdr.detectChanges();
  }

  // =======================
  // PERSISTANCE
  // =======================
  saveFormation(): void {
    const f = this.formation(); // On récupère la valeur actuelle du signal
    this.isSaving.set(true);
    this.saveMessage.set('Sauvegarde en cours...');

    // On détermine quelle méthode appeler selon la présence de l'ID
    const request$ = f.id
      ? this.formationService.updateFormation(f.id, f)  // Modification (PUT)
      : this.formationService.createFormation(f);       // Création (POST)

    request$.subscribe({
      next: (savedFormation) => {
        // Mise à jour du signal avec la réponse (qui contient le nouvel ID si c'est une création)
        this.formation.set(savedFormation);

        // Si l'élément sélectionné était la formation elle-même, on met à jour la sélection
        if (this.isFormation(this.selectedItem()!) && this.selectedItem() === f) {
          this.selectedItem.set(savedFormation);
        }

        this.lastSaved.set(savedFormation.derniereMiseAJour || new Date());
        this.isSaving.set(false);
        this.saveMessage.set(f.id ? 'Formation mise à jour avec succès !' : 'Formation créée avec succès !');

        // Faire disparaitre le message après 3 secondes
        setTimeout(() => this.saveMessage.set(''), 3000);
      },
      error: (err) => {
        console.error('Erreur sauvegarde', err);
        this.isSaving.set(false);
        this.saveMessage.set('Erreur lors de la sauvegarde.');
      }
    });
  }

  // =======================
  // AJOUT
  // =======================
  onAddCours(): void {
    this.formation.update(f => {
      const newCours: Cours = {
        titre: `Nouveau Cours ${f.cours?.length + 1}`,
        chapitres: []
      };
      f.cours?.push(newCours);
      this.onSelectItem(newCours);
      return { ...f };
    });
  }

  onAddChapitre(parentCours: Cours): void {
    this.formation.update(f => {
      const cours = f.cours?.find(c => c === parentCours);
      if (cours) {
        const newChapitre: Chapitre = {
          titre: `Nouveau Chapitre ${cours.chapitres.length + 1}`,
          sections: []
        };
        cours.chapitres.push(newChapitre);
        this.onSelectItem(newChapitre);
      }
      return { ...f };
    });
  }

  onAddSection(parentChapitre: Chapitre): void {
    this.formation.update(f => {
      for (const cours of f.cours) {
        const chapitre = cours.chapitres.find(ch => ch === parentChapitre);
        if (chapitre) {
          const newSection: Section = {
            titre: `Nouvelle Section ${chapitre.sections.length + 1}`,
            typeContenu: 'TEXTE',
            contenu: ''
          };
          chapitre.sections.push(newSection);
          this.onSelectItem(newSection);
          break;
        }
      }
      return { ...f };
    });
  }

  // =======================
  // SUPPRESSION
  // =======================
  onRemoveCours(cours: Cours): void {
    if (!confirm(`Supprimer "${cours.titre}" ?`)) return;

    this.formation.update(f => {
      f.cours = f.cours.filter(c => c !== cours);
      if (this.selectedItem() === cours) this.onSelectItem(f);
      return { ...f };
    });
  }

  onRemoveChapitre(event: { chapitre: Chapitre; parentCours: Cours }): void {
    if (!confirm(`Supprimer "${event.chapitre.titre}" ?`)) return;

    this.formation.update(f => {
      event.parentCours.chapitres =
        event.parentCours.chapitres.filter(ch => ch !== event.chapitre);

      if (this.selectedItem() === event.chapitre) {
        this.onSelectItem(event.parentCours);
      }
      return { ...f };
    });
  }

  onRemoveSection(event: { section: Section; parentChapitre: Chapitre }): void {
    if (!confirm(`Supprimer "${event.section.titre}" ?`)) return;

    this.formation.update(f => {
      event.parentChapitre.sections =
        event.parentChapitre.sections.filter(s => s !== event.section);

      if (this.selectedItem() === event.section) {
        this.onSelectItem(event.parentChapitre);
      }
      return { ...f };
    });
  }

  // =======================
  // TYPE GUARDS
  // =======================
  isFormation(item: ContentItem): item is Formation {
    return 'cours' in item;
  }

  isCours(item: ContentItem): item is Cours {
    return 'chapitres' in item && !('cours' in item);
  }

  isChapitre(item: ContentItem): item is Chapitre {
    return 'sections' in item && !('chapitres' in item);
  }

  isSection(item: ContentItem): item is Section {
    return 'typeContenu' in item;
  }

  // =======================
  // INITIAL DATA
  // =======================
  private getInitialData(): Formation {
    return {
      titre: 'Nouvelle Formation',
      description: '',
      niveau: 'Débutant',
      image: '',
      derniereMiseAJour: new Date(),
      prix: 0,
      publier: false,
      cours: []
    };
  }
}
