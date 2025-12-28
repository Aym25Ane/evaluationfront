import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Chapitre, Cours, Formation, Section} from '../../interfaces/formation';

@Component({
  selector: 'app-structure-explorer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './structure-explorer.component.html',
  styleUrls: ['./structure-explorer.component.css']
})
export class StructureExplorerComponent {
  @Input() formation: Formation | undefined;
  @Input() currentSelectedItem: Formation | Cours | Chapitre | Section | null = null;


  @Output() itemSelected = new EventEmitter<Formation | Cours | Chapitre | Section>();


  @Output() addCours = new EventEmitter<void>();
  @Output() addChapitre = new EventEmitter<Cours>();
  @Output() addSection = new EventEmitter<Chapitre>();


  @Output() removeCours = new EventEmitter<Cours>();
  @Output() removeChapitre = new EventEmitter<{chapitre: Chapitre, parentCours: Cours}>();
  @Output() removeSection = new EventEmitter<{section: Section, parentChapitre: Chapitre}>();

  selectItem(event: MouseEvent, item: Formation | Cours | Chapitre | Section): void {
    event.stopPropagation();
    this.itemSelected.emit(item);
  }

  isSelected(item: Formation | Cours | Chapitre | Section): boolean {
    return this.currentSelectedItem === item;
  }
}
