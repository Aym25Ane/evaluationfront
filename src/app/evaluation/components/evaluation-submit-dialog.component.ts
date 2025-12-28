import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-evaluation-submit-dialog',
  imports: [MatButtonModule, MatDialogModule],
  standalone: true,
  templateUrl: './evaluation-submit-dialog.component.html'
})
export class EvaluationSubmitDialogComponent {}
