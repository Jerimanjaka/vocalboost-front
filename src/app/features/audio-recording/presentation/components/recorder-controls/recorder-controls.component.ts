import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaRecorderService } from '../../../data/services/media-recorder.service';
import { AudioRepositoryImpl } from '../../../data/repositories/audio-repository.impl';
import { AudioRecordEntity } from '../../../domain/entities/audio-record.entity';

@Component({
  selector: 'app-recorder-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recorder-controls.component.html',
  styleUrls: ['./recorder-controls.component.scss']
})
export class RecorderControlsComponent {
  recorderService = inject(MediaRecorderService);
  private audioRepository = inject(AudioRepositoryImpl);

  uploadStatus: 'idle' | 'uploading' | 'success' | 'error' = 'idle';
  uploadMessage = '';

  async start() {
    try {
      await this.recorderService.startRecording();
    } catch (error) {
      console.error('Erreur démarrage:', error);
      this.uploadStatus = 'error';
      this.uploadMessage = 'Erreur: Impossible d\'accéder au microphone';
      this.showToast('Impossible d’accéder au micro', 'error');
    }
  }

  pause() {
    this.recorderService.pauseRecording();
  }

  resume() {
    this.recorderService.resumeRecording();
  }

  stop() {
    this.recorderService.stopRecording();
  }

  upload() {
    const blob = this.recorderService.state().audioBlob;
    if (!blob) return;

    this.uploadStatus = 'uploading';
    this.uploadMessage = 'Upload en cours...';
    this.showToast('Upload en cours…', 'info');

    const audioRecord = AudioRecordEntity.create(blob);

    this.audioRepository.uploadAudio(audioRecord).subscribe({
      next: (response) => {
        this.uploadStatus = 'success';
        this.uploadMessage = `Audio envoyé ! ID: ${response.id}`;
        console.log('Upload réussi:', response);
        this.showToast('Audio envoyé avec succès ✅', 'success');
      },
      error: (error) => {
        this.uploadStatus = 'error';
        this.uploadMessage = 'Erreur lors de l\'upload';
        console.error('Erreur upload:', error);
        this.showToast('Erreur lors de l’upload', 'error');
      }
    });
  }

  download() {
    const blob = this.recorderService.state().audioBlob;
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording_${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // ===== Toast global niveau app.component.html =====
  private showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const toast = document.getElementById('global-toast');
    if (!toast) { return; }

    const textEl = toast.querySelector('.toast-text') as HTMLElement | null;
    const iconEl = toast.querySelector('.toast-icon') as HTMLElement | null;

    if (textEl) {
      textEl.textContent = message;
    }

    if (iconEl) {
      if (type === 'success') iconEl.textContent = '✅';
      else if (type === 'error') iconEl.textContent = '⚠️';
      else iconEl.textContent = 'ℹ️';
    }

    toast.classList.remove('toast-hidden', 'toast-success', 'toast-error');
    if (type === 'success') toast.classList.add('toast-success');
    if (type === 'error') toast.classList.add('toast-error');

    toast.classList.add('toast-visible');

    setTimeout(() => {
      toast.classList.remove('toast-visible');
      toast.classList.add('toast-hidden');
    }, 3000);
  }
}
