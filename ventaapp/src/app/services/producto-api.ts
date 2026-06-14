import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class ProductoApi {

  private hostbase = 'http://10.3.2.189:3000/';
  private urlbase = this.hostbase + 'api/producto';
  constructor(private http: HttpClient) { } 

  getProductos():Observable<any> {
    return this.http.get(this.urlbase);
  }

  getProducto(id: number):Observable<any> {
    return this.http.get(`${this.urlbase}/${id}`);
  }

  createProducto(producto: any):Observable<any> {
    let httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    let body = JSON.stringify(producto);
    return this.http.post(this.urlbase, body, httpOptions);
  }

  updateProducto(producto: any):Observable<any> {
    let httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    let body = JSON.stringify(producto);
    return this.http.put(`${this.urlbase}/${producto.id}`, body, httpOptions);
  }

  deleteProducto(id: number):Observable<any> {
    return this.http.delete(`${this.urlbase}/${id}`);
  }

}
