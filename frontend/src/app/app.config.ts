import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
<<<<<<< HEAD

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay())
  ]
};
=======
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // ✅ Solo UNA vez, con fetch habilitado
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideBrowserGlobalErrorListeners(),
    provideCharts(withDefaultRegisterables()),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
  ]
};
>>>>>>> main
