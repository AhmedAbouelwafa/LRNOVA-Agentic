import { Component, inject, OnInit, OnDestroy, effect } from '@angular/core';
import { TypewriterService } from '../../../../core/services/typewriter.service';
import { LocalizationService } from '../../../../core/services/localization.service';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css'
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  private tw = inject(TypewriterService);
  protected i18n = inject(LocalizationService);
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

  constructor() {
    // React to language changes - update typewriter phrases
    effect(() => {
      const lang = this.i18n.currentLang();
      const phrases = [
        this.i18n.t('hero.phrase.experiences'),
        this.i18n.t('hero.phrase.courses'),
        this.i18n.t('hero.phrase.3d'),
        this.i18n.t('hero.phrase.videos'),
        this.i18n.t('hero.phrase.assessments'),
      ];
      if (this.headlineWriter) {
        this.headlineWriter.updatePhrases(phrases);
      }
    });
  }

  ngOnInit() {
    this.headlineWriter = this.typedHeadline;
    this.headlineWriter.start(2000);
  }

  ngOnDestroy() {
    this.headlineWriter.destroy();
  }
}
