import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // 🔥 siempre enviar cookies
  req = req.clone({
    withCredentials: true
  });

  return next(req);
};
