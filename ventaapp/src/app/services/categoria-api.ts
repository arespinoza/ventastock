import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoriaApi {
  private readonly urlbase = 'https://aplicaciones.fce.unju.edu.ar/ventasapi/api/categoria';

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(this.urlbase);
  }

  createCategoria(categoria: { nombre: string; descripcion: string }): Observable<any> {
    return this.http.post(this.urlbase, categoria);
  }
}