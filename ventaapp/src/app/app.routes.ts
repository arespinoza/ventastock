import { Routes } from '@angular/router';
import { ProductoList } from './components/producto-list/producto-list';
import { ProductoForm } from './components/producto-form/producto-form';
import { HomePage } from './components/home-page/home-page';
import { DetalleMovimientoForm } from './components/detalle-movimiento-form/detalle-movimiento-form';
import { DetalleMovimientoList } from './components/detalle-movimiento-list/detalle-movimiento-list';
import { PersonaList } from './components/persona-list/persona-list';
import { PersonaForm } from './components/persona-form/persona-form';
import { ProductoClienteList } from './components/producto-cliente-list/producto-cliente-list';
import { Login } from './components/login/login';
import { AbonoList } from './components/abono-list/abono-list';
import { AbonoForm } from './components/abono-form/abono-form';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    // Ruta para mostrar la lista de productos
    { path: 'login', component: Login },
    { path: 'catalogo', component: ProductoClienteList },
    { path: 'home', component: HomePage, canActivate: [adminGuard] },
    { path: 'producto-list', component: ProductoList, canActivate: [adminGuard] },
    { path: 'producto-form/:id', component: ProductoForm, canActivate: [adminGuard] },
    { path: 'persona-list', component:PersonaList, canActivate: [adminGuard]},
    { path: 'persona-form/:id', component: PersonaForm, canActivate: [adminGuard] },
    { path: 'detalle-movimiento-list', component: DetalleMovimientoList, canActivate: [adminGuard] },
    { path: 'detalle-movimiento-form/:id', component: DetalleMovimientoForm, canActivate: [adminGuard] },   
    { path: 'abono-list', component: AbonoList, canActivate: [adminGuard] },
    { path: 'abono-form/:id', component: AbonoForm, canActivate: [adminGuard] },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }

];
