import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { inject, PLATFORM_ID } from "@angular/core";
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { map } from 'rxjs';

export const authGuard: CanActivateFn =()=>{
  const auth = inject(AuthService)
  const router = inject(Router)
  const document = inject(DOCUMENT);
  //const storage = document.defaultView?.localStorage;
  //console.log("el tokennnn",window.localStorage)

  //ssr -> cookie only-html
  //scr -> localStorage

  const platformId = inject(PLATFORM_ID);


 /* if (!isPlatformBrowser(platformId)) {
    return false;
  }*/
  //console.log("el tokennnn",localStorage)
  return true;
  auth.checkAuth().subscribe(
    d => {
      console.log("--******--",d)
    }
  )
  return auth.checkAuth().pipe(
    map((dato)=>{
      console.log("------>",dato)
      if(dato)
        return true;
      router.navigate(['/login'])
      return false;
  }))
}
