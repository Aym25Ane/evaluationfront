// src/app/forms/chapitre-form/chapitre-form.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chapitre } from '../../../interfaces/formation';

@Component({
  selector: 'app-chapitre-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chapitre-form.component.html',
  styleUrl: './chapitre-form.component.css',
})
export class ChapitreFormComponent {
  @Input({ required: true }) chapitre!: Chapitre;

  @Output() chapitreChange = new EventEmitter<Chapitre>();

  /**
   * Méthode appelée par (ngModelChange) pour émettre la modification au parent.
   */
  onModelChange(): void {
    this.chapitreChange.emit(this.chapitre);
  }
}
