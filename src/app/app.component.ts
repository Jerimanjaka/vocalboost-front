import { Component } from '@angular/core';
import { RecorderControlsComponent } from './features/audio-recording/presentation/components/recorder-controls/recorder-controls.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RecorderControlsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'audio-recorder-app';
}