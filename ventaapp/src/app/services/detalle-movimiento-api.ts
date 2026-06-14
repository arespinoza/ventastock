import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DetalleMovimientoApi {
  private hostbase = 'http://10.3.2.189:3000/';
  private urlbase = this.hostbase + 'api/detallemovimiento/';  
  constructor(private http: HttpClient){

  }

  getDetallesMovimiento(){
    return this.http.get(this.urlbase);
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
