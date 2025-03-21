import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Force IPv4 (important for ngrok)
(window as any).global = window;

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
