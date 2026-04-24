import { Component, inject, signal } from "@angular/core";
import { AuthService, LoginData } from "../../core/services/auth.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { map } from "rxjs";

@Component({
  selector:'app-login',
  standalone:true,
  templateUrl:'login.component.html',
  imports:[FormsModule,CommonModule]
})
export class LoginComponent{
  login:String = '';
  pass:String = '';
  loading = signal<boolean>(false)
  error = signal<String>('');
  showPassword = signal<boolean>(false)
  authService = inject(AuthService)
  router = inject(Router)
  setError(msgError:string):void{
    this.error.set(msgError);
    this.loading.set(false);
  }
  onSubmit(){
    this.loading.set(true);
    this.error.set('');
    this.authService.login(this.login,this.pass)
    .subscribe({
          next:(data:Partial<LoginData>)=>{
            if(!data)
              this.setError('Credenciales incorrectas');
            if(data.message)
            {
              //alert("aaa");
              //this.authService.saveToken(data.me);
              const pp=this.authService.checkAuth().subscribe(s=>{
                console.log("/////",s);
              })
              /*(map(s=>{
                console.log("/////",s);
                return s
              }))*/
              console.log("*****",pp);
              this.router.navigate(['/dashboard']);
              return ;
            }
            this.setError('Credenciales incorrectas');
          },
          error:error=>{
            this.setError('Credenciales incorrectas');
          },
          complete:()=>{return false}
      })
  }
}
