import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environment";

interface LoginData{
  access_token:string;
  type:string;
}
@Injectable({providedIn:'root'})
export class AuthService{
  http = inject(HttpClient)

  login(login:String,pass:String){

    return this.http.post(environment.apiUrl+'/auth/login',
      {
        login:login,
        pass:pass
      }).subscribe({
          next:(data:Partial<LoginData>)=>{
            if(!data)
              return false;
            if(data.access_token)
            {
              localStorage.setItem('token',data.access_token)
              return true;
            }
            return false;
          },
          error:error=>{return false},
          complete:()=>{return false}
      });
  }
}
