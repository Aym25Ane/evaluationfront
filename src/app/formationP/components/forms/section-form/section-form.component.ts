// src/app/forms/section-form/section-form.component.ts
import {Component, Input, Output, EventEmitter, inject, signal, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Section } from '../../../interfaces/formation';
import {FormationService} from '../../../services/formation.service';
 // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-section-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './section-form.component.html',
  // Utilisation du fichier de style externe
  styleUrl: './section-form.component.css',
})
export class SectionFormComponent {

  @Input({ required: true }) section!: Section;

  @Output() sectionChange = new EventEmitter<Section>();
  filePreview = signal<string | null>(null);
  typeContenuOptions: Section['typeContenu'][] = ['TEXTE', 'IMAGE', 'VIDEO'];



  private formationService = inject(FormationService);

  isUploading = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['section']) {
      this.filePreview.set(null);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input?.files[0]) {
      const file = input?.files[0];

      this.isUploading.set(true); // Début de l'upload
      this.filePreview.set(null); // Réinitialise l'ancien aperçu

      // 4. Appelez le service d'upload
      this.formationService.uploadFile(file).subscribe({
        next: (response) => {

          // 5. Mettez à jour la propriété 'contenu' avec l'URL retournée par le backend
          this.section.contenu = response.fileUrl;
          this.filePreview.set(response.fileUrl); // Affiche le nouvel aperçu depuis l'URL
          this.isUploading.set(false); // Fin de l'upload
        },
        error: (err) => {
          console.error('Erreur d\'upload:', err);
          alert(`Erreur lors de l'upload : ${err.error?.error || err.message}`);
          this.isUploading.set(false); // Fin de l'upload (en erreur)
        }
      });
    }
 }
  onTypeContenuChange(): void {
    this.filePreview.set(null);
    this.section.contenu = '';
  }
}
