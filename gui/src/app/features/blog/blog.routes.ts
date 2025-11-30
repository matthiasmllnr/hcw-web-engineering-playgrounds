import { Routes } from '@angular/router';
import { Blog } from './pages';

export const BLOG_ROUTES: Routes = [
  {
    path: '',
    component: Blog,
    title: 'Blog',
  },
];
