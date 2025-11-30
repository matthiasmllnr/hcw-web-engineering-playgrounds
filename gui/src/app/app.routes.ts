import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', loadChildren: () => import('./features/home').then((m) => m.HOME_ROUTES) },
  {
    path: 'our-team',
    loadChildren: () => import('./features/our-team').then((m) => m.OUR_TEAM_ROUTES),
  },
  {
    path: 'projects',
    loadChildren: () => import('./features/projects').then((m) => m.PROJECTS_ROUTES),
  },
  { path: 'blog', loadChildren: () => import('./features/blog').then((m) => m.BLOG_ROUTES) },
];
