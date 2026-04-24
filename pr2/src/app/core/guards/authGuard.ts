import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { inject, PLATFORM_ID } from "@angular/core";
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn =()=>{
  const auth = inject(AuthService)
  const router = inject(Router)
  const document = inject(DOCUMENT);
  const storage = document.defaultView?.localStorage;
  //console.log("el tokennnn",window.localStorage)

  const platformId = inject(PLATFORM_ID);

  // 🔥 SSR SAFE
  if (!isPlatformBrowser(platformId)) {
    return false;
  }
  console.log("el tokennnn",localStorage)

  if(auth.isLoggedIn())
    return true;
  router.navigate(['/login'])
  return false;
}
