import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { TypewriterService } from '../../../../core/services/typewriter.service';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css'
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  private tw = inject(TypewriterService);
  private headlineWriter!: ReturnType<TypewriterService['create']>;

  protected typedHeadline = this.tw.create({
    phrases: ['Experiences', 'LRNOVA Courses', 'Interactive 3D', 'LRNOVA AI Videos', 'Smart Assessments'],
    typingSpeed: 100,
    deletingSpeed: 60,
    delayBetweenPhrases: 2000,
    initialPhrase: 'Experiences',
    initialCharIndex: 11,
    startDeleting: true
  });

  ngOnInit() {
    this.headlineWriter = this.typedHeadline;
    this.headlineWriter.start(2000);
  }

  ngOnDestroy() {
    this.headlineWriter.destroy();
  }
}
