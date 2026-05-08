import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'
import { AuthService } from '../services/auth.service'

export const roleGuard: CanActivateFn = () => {
  const auth = inject(AuthService)
  const router = inject(Router)
  const rol = auth.getRole()
  console.log('roleGuard - rol actual:', rol)
  if (rol === 'admin') return true
  router.navigate(['/login'])
  return false
}