import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formation } from '../interfaces/formation';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormationService {


  private readonly apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Créer une nouvelle formation
   */
  createFormation(formation: Formation): Observable<Formation> {
    return this.http.post<Formation>(`${this.apiUrl}/formations`, formation);
  }

  /**
   * Upload d'un fichier (image ou PDF)
   */
  uploadFile(file: File): Observable<{ fileUrl: string, fileType: string }> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<{ fileUrl: string, fileType: string }>(
      `${this.apiUrl}/file/upload`,
      formData
    );
  }

  /**
   * Récupérer toutes les formations
   */
  getFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/formations`);
  }

  /**
   * Récupérer une formation par ID
   */
  getFormationById(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/formations/${id}`);
  }

  /**
   * Mettre à jour une formation
   */
  updateFormation(id: number, formation: Formation): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/formations/${id}`, formation);
  }

  /**
   * Supprimer une formation
   */
  deleteFormation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/formations/${id}`, );
  }

  searchFormations(keyword: string): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/formations/search?keyword=${keyword}`);
  }
}
