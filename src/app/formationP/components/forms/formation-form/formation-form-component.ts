import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Formation } from '../../../interfaces/formation';
import { FormationService } from '../../../services/formation.service';

@Component({
  selector: 'app-formation-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formation-form.component.html',
  styleUrl: './formation-form.component.css',
})
export class FormationFormComponent {

  @Input({ required: true }) formation!: Formation;
  @Output() formationChange = new EventEmitter<Formation>();

  // --- Signals pour l’upload ---
  isUploading = signal(false);
  imagePreview = signal<string | null>(null);

  constructor(private formationService: FormationService) {}

  onModelChange(): void {
    this.formationChange.emit(this.formation);
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input?.files[0]) {
      const file = input?.files[0];

      this.isUploading.set(true);
      this.imagePreview.set(null);

      this.formationService.uploadFile(file).subscribe({
        next: (response) => {
          // Le backend retourne : { fileUrl: "http://..." }
          this.formation.image = response.fileUrl;

          // Aperçu de l'image
          this.imagePreview.set(response.fileUrl);

          // Emettre au parent !
          this.formationChange.emit(this.formation);

          this.isUploading.set(false);
        },
        error: (err) => {
          console.error("Erreur d'upload :", err);
          alert(`Erreur lors de l'upload : ${err.error?.error || err.message}`);
          this.isUploading.set(false);
        }
      });
    }
  }
}
