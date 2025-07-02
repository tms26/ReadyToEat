import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000/api/profile';

  constructor(private http: HttpClient) { }

  getProfile(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/password`, data);
  }

  getChart(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/charts`);
  }

  getGlobalChart(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/globalCharts`);
  }
}