import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable,PLATFORM_ID, signal  } from "@angular/core";
import { environment } from "../../environment";
import { isPlatformBrowser } from '@angular/common';

export interface LoginData{
  access_token:string;
  type:string;
}
@Injectable({providedIn:'root'})
export class AuthService{
  http = inject(HttpClient)
  private platformId=inject(PLATFORM_ID)
  private _token = signal<string | null>(localStorage.getItem('token'));
  isLoggedIn = computed(() => !!this._token());
  login(login:String,pass:String){
    localStorage.clear()
    return this.http.post(environment.apiUrl+'/auth/login',
      {
        login:login,
        pass:pass
      });
  }
  saveToken(token:string){
    localStorage.setItem('token',token);
    console.log(localStorage.getItem('token'))
  }
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
  getToken():String|null{
    return localStorage.getItem('token');
  }
  logout(){
    localStorage.removeItem('token');
  }

}
