import { Observable } from 'rxjs';
import { AudioRecord } from '../entities/audio-record.entity';

export abstract class AudioRepository {
  abstract uploadAudio(audioRecord: AudioRecord): Observable<{ id: string; url: string }>;
  abstract downloadProcessedAudio(id: string): Observable<Blob>;
  abstract getRecordingStatus(id: string): Observable<{ status: string; processedUrl?: string }>;
}