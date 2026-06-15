import { Routes } from '@angular/router';
import { ProductoList } from './components/producto-list/producto-list';
import { ProductoForm } from './components/producto-form/producto-form';
import { HomePage } from './components/home-page/home-page';
import { DetalleMovimientoForm } from './components/detalle-movimiento-form/detalle-movimiento-form';
import { DetalleMovimientoList } from './components/detalle-movimiento-list/detalle-movimiento-list';
import { PersonaList } from './components/persona-list/persona-list';
import { PersonaForm } from './components/persona-form/persona-form';

export const routes: Routes = [
    // Ruta para mostrar la lista de productos
    { path: 'home', component: HomePage },
    { path: 'producto-list', component: ProductoList },
    { path: 'producto-form/:id', component: ProductoForm },
    { path: 'persona-list', component:PersonaList},
    { path: 'persona-form/:id', component: PersonaForm },
    { path: 'detalle-movimiento-list', component: DetalleMovimientoList },
    { path: 'detalle-movimiento-form/:id', component: DetalleMovimientoForm },   
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];
