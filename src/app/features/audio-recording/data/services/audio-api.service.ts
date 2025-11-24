import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AudioApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  uploadAudio(audioBlob: Blob, fileName: string): Observable<{ id: string; url: string }> {
    const formData = new FormData();
    formData.append('audio', audioBlob, fileName);

    return this.http.post<{ id: string; url: string }>(
      `${this.apiUrl}${environment.apiEndpoints.upload}`,
      formData
    );
  }

  downloadProcessedAudio(id: string): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}${environment.apiEndpoints.download}/${id}`,
      { responseType: 'blob' }
    );
  }

  getProcessingStatus(id: string): Observable<{ status: string; processedUrl?: string }> {
    return this.http.get<{ status: string; processedUrl?: string }>(
      `${this.apiUrl}${environment.apiEndpoints.process}/${id}/status`
    );
  }
}