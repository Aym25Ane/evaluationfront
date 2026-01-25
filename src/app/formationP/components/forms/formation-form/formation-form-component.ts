// src/app/forms/formation-form/formation-form.component.ts

import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Formation, Categorie } from '../../../interfaces/formation';
import { FormationService } from '../../../services/formation.service';

@Component({
  selector: 'app-formation-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formation-form.component.html',
  styleUrls: ['./formation-form.component.css'],
})
export class FormationFormComponent implements OnInit {

  @Input({ required: true }) formation!: Formation;
  @Output() formationChange = new EventEmitter<Formation>();

  // Upload image
  isUploading = signal(false);
  imagePreview = signal<string | null>(null);

  // Catégories
  categories = signal<Categorie[]>([]);
  isLoadingCategories = signal(false);

  constructor(private formationService: FormationService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // =======================
  // CATEGORIES (BACKEND)
  // =======================
  private loadCategories(): void {
    this.isLoadingCategories.set(true);

    this.formationService.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats);
        this.isLoadingCategories.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement catégories', err);
        this.isLoadingCategories.set(false);
      }
    });
  }

  // =======================
  // FORM CHANGE
  // =======================
  onModelChange(): void {
    this.formationChange.emit(this.formation);
  }

  onCategorieChange(categoryId: string): void {
    const categorie = this.categories().find(c => c.id === Number(categoryId));
    if (categorie) {
      this.formation.categorie = categorie;
      this.onModelChange();
    }
  }

  // =======================
  // IMAGE UPLOAD
  // =======================
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.isUploading.set(true);
    this.imagePreview.set(null);

    this.formationService.uploadFile(file).subscribe({
      next: (response) => {
        this.formation.image = response.fileUrl;
        this.imagePreview.set(response.fileUrl);
        this.onModelChange();
        this.isUploading.set(false);
      },
      error: (err) => {
        console.error("Erreur d'upload :", err);
        alert(`Erreur upload : ${err.error?.error || err.message}`);
        this.isUploading.set(false);
      }
    });
  }
}
