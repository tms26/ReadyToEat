import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DishesService {
private apiUrl = 'http://localhost:3000/api/dishes';

  constructor(private http: HttpClient) { }

  getDishById(dishId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${dishId}`);
  }
  
}
