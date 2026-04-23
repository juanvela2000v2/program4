import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";
import { DOCUMENT } from '@angular/common';

export const authGuard: CanActivateFn =()=>{
  const auth = inject(AuthService)
  const router = inject(Router)
  const document = inject(DOCUMENT);
  const storage = document.defaultView?.localStorage;
  //console.log("el tokennnn",localStorage)
  //console.log("el tokennnn",window.localStorage)

  //if(auth.isLoggedIn())
  return true;
  router.navigate(['/login'])
  return false;
}
