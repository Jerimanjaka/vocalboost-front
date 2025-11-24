import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
}

@Injectable({ providedIn: 'root' })
export class MediaRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private startTime: number = 0;
  private pausedDuration: number = 0;
  private durationInterval: any = null;
  
  private recordingStateSubject = new Subject<RecordingState>();
  public recordingState$ = this.recordingStateSubject.asObservable();
  
  public state = signal<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null
  });

  async startRecording(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      
      const options = { mimeType: 'audio/webm' };
      this.mediaRecorder = new MediaRecorder(this.stream, options);
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.updateState({ audioBlob, isRecording: false, isPaused: false });
        if (this.durationInterval) {
          clearInterval(this.durationInterval);
        }
      };

      this.mediaRecorder.start();
      this.startTime = Date.now();
      this.updateState({ isRecording: true, isPaused: false, duration: 0 });
      this.startDurationTimer();
    } catch (error) {
      console.error('Erreur lors du démarrage de l\'enregistrement:', error);
      throw error;
    }
  }

  pauseRecording(): void {
    if (this.mediaRecorder && this.state().isRecording && !this.state().isPaused) {
      this.mediaRecorder.pause();
      this.pausedDuration = Date.now() - this.startTime;
      this.updateState({ isPaused: true });
    }
  }

  resumeRecording(): void {
    if (this.mediaRecorder && this.state().isPaused) {
      this.mediaRecorder.resume();
      this.startTime = Date.now() - this.pausedDuration;
      this.updateState({ isPaused: false });
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.stream?.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  private startDurationTimer(): void {
    this.durationInterval = setInterval(() => {
      if (!this.state().isRecording) {
        clearInterval(this.durationInterval);
        return;
      }
      if (!this.state().isPaused) {
        const duration = Math.floor((Date.now() - this.startTime) / 1000);
        this.updateState({ duration });
      }
    }, 1000);
  }

  private updateState(partial: Partial<RecordingState>): void {
    const newState = { ...this.state(), ...partial };
    this.state.set(newState);
    this.recordingStateSubject.next(newState);
  }
}