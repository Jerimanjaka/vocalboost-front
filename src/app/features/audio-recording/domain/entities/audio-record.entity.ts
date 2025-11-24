export interface AudioRecord {
  id: string;
  blob: Blob;
  duration: number;
  createdAt: Date;
  status: 'recording' | 'paused' | 'stopped' | 'uploading' | 'uploaded' | 'processed';
  fileName: string;
  size: number;
  processedUrl?: string;
}

export class AudioRecordEntity implements AudioRecord {
  constructor(
    public id: string,
    public blob: Blob,
    public duration: number,
    public createdAt: Date,
    public status: AudioRecord['status'],
    public fileName: string,
    public size: number,
    public processedUrl?: string
  ) {}

  static create(blob: Blob): AudioRecordEntity {
    return new AudioRecordEntity(
      crypto.randomUUID(),
      blob,
      0,
      new Date(),
      'stopped',
      `recording_${Date.now()}.webm`,
      blob.size
    );
  }
}