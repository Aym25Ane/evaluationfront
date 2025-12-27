import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { EvaluationStatusChipComponent } from '../../components/evaluation-status-chip.component';
import { DashboardStats, Evaluation } from '../../models/evaluation.models';
import { EvaluationService } from '../../services/evaluation.service';

@Component({
  selector: 'app-evaluation-dashboard',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    RouterLink,
    EvaluationStatusChipComponent
  ],
  templateUrl: './evaluation-dashboard.component.html',
  styleUrl: './evaluation-dashboard.component.scss'
})
export class EvaluationDashboardComponent implements OnInit, AfterViewInit {
  displayedColumns = ['title', 'course', 'type', 'status', 'score', 'actions'];
  dataSource = new MatTableDataSource<Evaluation>([]);
  stats: DashboardStats | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private evaluationService: EvaluationService, private router: Router) {}

  ngOnInit(): void {
    this.evaluationService.getEvaluations().subscribe((evaluations) => {
      this.dataSource.data = evaluations;
    });

    this.evaluationService.getDashboardStats().subscribe((stats) => {
      this.stats = stats;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  startEvaluation(evaluation: Evaluation): void {
    this.router.navigate(['/evaluation/take', evaluation.id]);
  }

  viewResults(evaluation: Evaluation): void {
    this.router.navigate(['/evaluation/results', evaluation.id]);
  }

  viewDetails(evaluation: Evaluation): void {
    this.router.navigate(['/evaluation/results', evaluation.id]);
  }

  canStart(status: Evaluation['status']): boolean {
    return status === 'Not Started' || status === 'In Progress';
  }

  canViewResults(status: Evaluation['status']): boolean {
    return status === 'Completed';
  }
}
