import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'
import { AuthService } from '../services/auth.service'

export const enfermeraGuard: CanActivateFn = () => {
    const auth = inject(AuthService)
    const router = inject(Router)
    if (auth.getRole() === 'enfermera') return true
    router.navigate(['/login'])
    return false
}