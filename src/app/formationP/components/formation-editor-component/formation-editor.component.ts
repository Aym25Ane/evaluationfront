// src/app/components/formation-editor/formation-editor.component.ts
import {Component, OnInit, signal, inject, Signal, WritableSignal, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';

import { StructureExplorerComponent } from '../structure-explorer/structure-explorer.component';
import { FormationService } from '../../services/formation.service';
import { CourseFormComponent } from '../forms/course-form/course-form.component';
import { ChapitreFormComponent } from '../forms/chapitre-form/chapitre-form.component';
import { SectionFormComponent } from '../forms/section-form/section-form.component';
import { FormationFormComponent } from '../forms/formation-form/formation-form-component';


import { FormationSelectionStateService } from '../../services/formation-selection-state-service';
import {Chapitre, ContentItem, Cours, Formation, Section} from '../../interfaces/formation';

@Component({
  selector: 'app-formation-editor',
  standalone: true,
  imports: [
    CommonModule,
    StructureExplorerComponent,
    FormationFormComponent,
    CourseFormComponent,
    ChapitreFormComponent,
    SectionFormComponent,
  ],
  templateUrl: './formation-editor.component.html',
  styleUrls: ['./formation-editor.component.css']
})
export class FormationEditorComponent implements OnInit {


  formation!: WritableSignal<Formation>;

  selectedItem: WritableSignal<ContentItem | null> = signal(null);
  lastSaved: WritableSignal<Date | null> = signal(null);

  isSaving: WritableSignal<boolean> = signal(false);
  saveMessage: WritableSignal<string> = signal('');

  private formationService = inject(FormationService);
  constructor(private formationSelectionStateService: FormationSelectionStateService,
              private cdr :ChangeDetectorRef
) {}

  ngOnInit(): void {
    const initialFormation = this.formationSelectionStateService.getCurrentFormation();
    this.formation = signal<Formation>(initialFormation ?? this.getInitialData());
    this.onSelectItem(this.formation());
  }

  onSelectItem(item: ContentItem): void {
    this.selectedItem.set(item);
  }

  // MÉTHODE CLÉ : Met à jour l'élément sélectionné et force le rafraîchissement du signal formation.
  onUpdateSelectedItem(updatedItem: ContentItem): void {
   if(this.isFormation(updatedItem)){
     this.formation.set(updatedItem)
   }
    this.cdr.detectChanges();
    this.selectedItem.set(updatedItem);
    this.formation.update(f => ({ ...f }));
  }

  // --- LOGIQUE DE PERSISTANCE ---
  saveFormation(): void {
    this.isSaving.set(true);
    this.formationService.createFormation(this.formation()).subscribe({
      next: (savedFormation) => {
        this.formation.set(savedFormation);
        this.lastSaved.set(savedFormation.derniereMiseAJour);
        this.isSaving.set(false);
      },
      error: (err) => {
        console.error('Erreur lors de la création:', err);
        this.isSaving.set(false);
      }
    });
  }

  // --- AJOUT ---
  onAddCours(): void {
    this.formation.update(f => {
      if (!f.cours) f.cours = [];
      const newCours: Cours = { id: undefined, titre: `Nouveau Cours ${f.cours.length + 1}`, chapitres: [] };
      f.cours.push(newCours);
      this.onSelectItem(newCours);
      return { ...f };
    });
  }

  onAddChapitre(parentCours: Cours): void {
    this.formation.update(f => {
      const coursToUpdate = f.cours!.find(c => c.id === parentCours.id);
      if (coursToUpdate) {
        if (!coursToUpdate.chapitres) coursToUpdate.chapitres = [];
        const newChapitre: Chapitre = { id: undefined, titre: `Nouveau Chapitre ${coursToUpdate.chapitres.length + 1}`, sections: [] };
        coursToUpdate.chapitres.push(newChapitre);
        this.onSelectItem(newChapitre);
      }
      return { ...f };
    });
  }

  onAddSection(parentChapitre: Chapitre): void {
    this.formation.update(f => {
      for (const cours of f.cours!) {
        const chapitreToUpdate = cours.chapitres!.find(ch => ch.id === parentChapitre.id);
        if (chapitreToUpdate) {
          if (!chapitreToUpdate.sections) chapitreToUpdate.sections = [];
          const newSection: Section = { id: undefined, titre: `Nouvelle Section ${chapitreToUpdate.sections.length + 1}`, typeContenu: 'TEXTE', contenu: '' };
          chapitreToUpdate.sections.push(newSection);
          this.onSelectItem(newSection);
          return { ...f };
        }
      }
      return f;
    });
  }

  // --- SUPPRESSION ---
  onRemoveCours(coursToRemove: Cours): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le cours "${coursToRemove.titre}" ?`)) {
      this.formation.update(f => {
        f.cours = f.cours!.filter(c => c.id !== coursToRemove.id);
        if (this.selectedItem() === coursToRemove) this.onSelectItem(f);
        return { ...f };
      });
    }
  }

  onRemoveChapitre(event: { chapitre: Chapitre; parentCours: Cours }): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le chapitre "${event.chapitre.titre}" ?`)) {
      this.formation.update(f => {
        const coursToUpdate = f.cours!.find(c => c.id === event.parentCours.id);
        if (coursToUpdate) {
          coursToUpdate.chapitres = coursToUpdate.chapitres!.filter(ch => ch.id !== event.chapitre.id);
          if (this.selectedItem() === event.chapitre) this.onSelectItem(coursToUpdate);
        }
        return { ...f };
      });
    }
  }

  onRemoveSection(event: { section: Section; parentChapitre: Chapitre }): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la section "${event.section.titre}" ?`)) {
      this.formation.update(f => {
        for (const cours of f.cours!) {
          const chapitreToUpdate = cours.chapitres!.find(ch => ch.id === event.parentChapitre.id);
          if (chapitreToUpdate) {
            chapitreToUpdate.sections = chapitreToUpdate.sections!.filter(s => s.id !== event.section.id);
            if (this.selectedItem() === event.section) this.onSelectItem(chapitreToUpdate);
            return { ...f };
          }
        }
        return f;
      });
    }
  }

  // --- TYPE GUARDS ---
  isFormation(item: ContentItem): item is Formation {
    return (item as Formation).cours !== undefined && (item as Cours).chapitres === undefined;
  }
  isCours(item: ContentItem): item is Cours {
    return (item as Cours).chapitres !== undefined && (item as Chapitre).sections === undefined;
  }
  isChapitre(item: ContentItem): item is Chapitre {
    return (item as Chapitre).sections !== undefined && (item as Section).typeContenu === undefined;
  }
  isSection(item: ContentItem): item is Section {
    return (item as Section).typeContenu !== undefined;
  }

  private getInitialData(): Formation {
    return {
      titre: 'Nouveau Titre de Formation',
      derniereMiseAJour: new Date(),
      description: '',
      niveau: 'Débutant',
      cours: []
    };
  }
}
