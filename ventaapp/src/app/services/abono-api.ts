import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AbonoApi {
  private hostbase = 'https://aplicaciones.fce.unju.edu.ar/ventasapi/';
  private urlbase = this.hostbase + 'api/abono/';

  constructor(private http: HttpClient) {}

  getAbonos(detalleMovimientoId?: number, personaId?: number) {
    let params = new HttpParams();
    if (detalleMovimientoId) {
      params = params.set('detalleMovimientoId', detalleMovimientoId);
    }
    if (personaId) {
      params = params.set('personaId', personaId);
    }
    return this.http.get(this.urlbase, { params });
  }

  getAbono(id: number) {
    return this.http.get(this.urlbase + id);
  }

  createAbono(abono: unknown) {
    return this.http.post(this.urlbase, abono);
  }

  updateAbono(abono: { id: number }) {
    return this.http.put(this.urlbase + abono.id, abono);
  }

  deleteAbono(id: number) {
    return this.http.delete(this.urlbase + id);
  }
}
