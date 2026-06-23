import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const alumnoGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getCurrentUser();
  
  if (user && user.role === 'Alumno') {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};
