import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DetalleMovimientoApi {
  private hostbase = 'https://aplicaciones.fce.unju.edu.ar/ventasapi/';
  private urlbase = this.hostbase + 'api/detallemovimiento/';  
  constructor(private http: HttpClient){

  }

  getDetallesMovimiento(){
    return this.http.get(this.urlbase);
  }

  getDetallesMovimientoPersona(id: number){
    let httpOption = {
      headers: {
      },
      params: new HttpParams().set('personaId', id)
    };


    return this.http.get(this.urlbase, httpOption);
  }
  
  getDetalleMovimiento(id: number){
    return this.http.get(this.urlbase + id);
  }


  createDetalleMovimiento(detalleMovimiento: any){
    let httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    let body = JSON.stringify(detalleMovimiento);
    return this.http.post(this.urlbase, body, httpOptions);
  }

  updateDetalleMovimiento(detalleMovimiento: any){
    let httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    let body = JSON.stringify(detalleMovimiento);
    return this.http.put(this.urlbase  + detalleMovimiento.id, body, httpOptions);
  }

  deleteDetalleMovimiento(id: number){
    return this.http.delete(this.urlbase  + id);
  }  
}
