import { Routes } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'events', component: EventListComponent, canActivate: [AuthGuard] }
];
