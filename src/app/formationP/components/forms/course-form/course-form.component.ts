// src/app/forms/course-form/course-form.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cours } from '../../../interfaces/formation'; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.css',
})
export class CourseFormComponent {
  @Input({ required: true }) cours!: Cours;

  @Output() coursChange = new EventEmitter<Cours>();

  onModelChange(): void {
    this.coursChange.emit(this.cours);
  }
}
