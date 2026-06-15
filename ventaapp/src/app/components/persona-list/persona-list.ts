import { ChangeDetectorRef, Component } from '@angular/core';
import { PersonaApi } from '../../services/persona-api';
import { Router, RouterLink } from '@angular/router';
import { Persona } from '../../models/persona';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-persona-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './persona-list.html',
  styleUrl: './persona-list.css',
})
export class PersonaList {
  personas: Array<Persona> = [];

  constructor(private personaApi: PersonaApi,
              private router: Router,
              private cd: ChangeDetectorRef) {
                this.getPersonas();
              }


  getPersonas() {
    this.personaApi.getPersonas().subscribe((data) => {
      this.personas = data;
      this.cd.detectChanges();
    });
  }


  navigateTo(path: string) {
    console.log('Navegando a:', path);
    this.router.navigate([path]);
  }

  deletePersona(id: number) {
    if (confirm('¿Estás seguro de eliminar esta persona?')) {
      this.personaApi.deletePersona(id).subscribe(() => {
        this.getPersonas();
        this.cd.detectChanges();
      });
    }
  }     
  
  redirigir(path: string){
    this.router.navigate([path]);
  }
}
