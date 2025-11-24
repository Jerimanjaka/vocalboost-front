import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { AudioRepository } from './features/audio-recording/domain/repositories/audio.repository';
import { AudioRepositoryImpl } from './features/audio-recording/data/repositories/audio-repository.impl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: AudioRepository, useClass: AudioRepositoryImpl }
  ]
};