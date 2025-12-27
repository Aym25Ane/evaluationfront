import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { EvaluationStatus } from '../models/evaluation.models';

@Component({
  selector: 'app-evaluation-status-chip',
  imports: [MatChipsModule],
  templateUrl: './evaluation-status-chip.component.html',
  styleUrl: './evaluation-status-chip.component.scss'
})
export class EvaluationStatusChipComponent {
  @Input({ required: true }) status!: EvaluationStatus;

  get tone(): string {
    switch (this.status) {
      case 'Completed':
        return 'status-success';
      case 'In Progress':
        return 'status-warning';
      default:
        return 'status-neutral';
    }
  }
}
