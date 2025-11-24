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
      alert('Erreur: Impossible d\'accéder au microphone');
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

    const audioRecord = AudioRecordEntity.create(blob);
    
    this.audioRepository.uploadAudio(audioRecord).subscribe({
      next: (response) => {
        this.uploadStatus = 'success';
        this.uploadMessage = `Audio envoyé ! ID: ${response.id}`;
        console.log('Upload réussi:', response);
      },
      error: (error) => {
        this.uploadStatus = 'error';
        this.uploadMessage = 'Erreur lors de l\'upload';
        console.error('Erreur upload:', error);
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
}