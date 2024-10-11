import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './Auth/CookiesConfig/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { loadingInterceptor } from './Auth/CookiesConfig/loading.interceptor';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
    }),
    importProvidersFrom([BrowserAnimationsModule])
  ]
};
