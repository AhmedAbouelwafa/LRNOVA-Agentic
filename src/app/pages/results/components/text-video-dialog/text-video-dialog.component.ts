import { Component, signal, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface VideoStyle {
  id: string;
  label: string;
  image: string;
}

@Component({
  selector: 'app-text-video-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './text-video-dialog.component.html',
  styleUrl: './text-video-dialog.component.css'
})
export class TextVideoDialogComponent {
  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<{
    style: VideoStyle;
    duration: string;
  }>();

  activeTab = signal<'style' | 'duration'>('style');

  selectedStyle = signal<VideoStyle | null>(null);
  selectedDuration = signal<string | null>(null);

  durations = ['1 minute', '2 minutes', '3 minutes', '4 minutes'];

  readonly defaultStyles: VideoStyle[] = [
    { id: 'cinematic', label: 'Cinematic', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80' },
    { id: 'minimalist', label: 'Minimalist', image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=300&q=80' },
    { id: 'corporate', label: 'Corporate', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80' },
    { id: 'playful', label: 'Playful', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=300&q=80' },
    { id: 'neon', label: 'Neon Sci-Fi', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=300&q=80' },
    { id: 'vintage', label: 'Vintage Retro', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=300&q=80' }
  ];

  setTab(tab: 'style' | 'duration') {
    this.activeTab.set(tab);
  }

  selectStyle(style: VideoStyle) {
    this.selectedStyle.set(style);
  }

  close() {
    this.closed.emit();
  }

  generate() {
    if (this.canGenerate) {
      this.confirmed.emit({
        style: this.selectedStyle()!,
        duration: this.selectedDuration()!
      });
    }
  }

  get canGenerate(): boolean {
    return this.selectedStyle() !== null &&
           this.selectedDuration() !== null;
  }
}
