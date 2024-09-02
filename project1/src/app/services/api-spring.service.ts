import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiSpringService {
  constructor(private http: HttpClient) {}

  public doPost(url: string, data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(url, data, { headers });
  }

  public doGet(url: string): Observable<any[]> {  // Especifica que el Observable es un array
    return this.http.get<any[]>(url);
  }

  public doPut(url: string, data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(url, data, { headers });
  }

  public doDelete(url: string, data: any): Observable<any> {
    return this.http.delete<any>(url, { body: data });
  }
}
