import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonaApi {
  private hostbase = 'http://10.3.2.189:3000/';
  private urlbase = this.hostbase + 'api/persona';
  constructor(private http: HttpClient) { } 

  getPersonas():Observable<any> {
    return this.http.get(this.urlbase);
  }
  getPersona(id: number):Observable<any> {
    return this.http.get(`${this.urlbase}/${id}`);
  }

  createPersona(persona: any):Observable<any> {
    let httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    let body = JSON.stringify(persona);
    return this.http.post(this.urlbase, body, httpOptions);
  }

  updatePersona(persona: any):Observable<any> {
    let httpOptions = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    let body = JSON.stringify(persona);
    return this.http.put(`${this.urlbase}/${persona.id}`, body, httpOptions);
    
  }
  deletePersona(id: number):Observable<any> {
    return this.http.delete(`${this.urlbase}/${id}`);
  }
}
