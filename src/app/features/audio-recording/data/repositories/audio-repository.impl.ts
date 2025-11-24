import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AudioRepository } from '../../domain/repositories/audio.repository';
import { AudioRecord } from '../../domain/entities/audio-record.entity';
import { AudioApiService } from '../services/audio-api.service';

@Injectable({ providedIn: 'root' })
export class AudioRepositoryImpl extends AudioRepository {
  private audioApiService = inject(AudioApiService);

  uploadAudio(audioRecord: AudioRecord): Observable<{ id: string; url: string }> {
    return this.audioApiService.uploadAudio(audioRecord.blob, audioRecord.fileName);
  }

  downloadProcessedAudio(id: string): Observable<Blob> {
    return this.audioApiService.downloadProcessedAudio(id);
  }

  getRecordingStatus(id: string): Observable<{ status: string; processedUrl?: string }> {
    return this.audioApiService.getProcessingStatus(id);
  }
}