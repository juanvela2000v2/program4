import { Component, inject, signal } from "@angular/core";
import { AuthService } from "../../core/services/auth.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

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
  onSubmit(){
    console.log("**")
    this.loading.set(true);
    this.error.set('');
    const ok = this.authService.login(this.login,this.pass)
    console.log(ok)
    alert(ok)
    if(ok){
      alert('asdas');
      this.router.navigate(['/dashboard']);
    }
    else{
      this.error.set('Credenciales incorrectas');
      this.loading.set(false);
    }
  }
}
