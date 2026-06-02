import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TypewriterService {
  private timeoutId: any;

  /**
   * Start a typewriter effect that cycles through given phrases.
   * Returns a signal that updates with each character change.
   */
  create(config: {
    phrases: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    delayBetweenPhrases?: number;
    initialPhrase?: string;
    initialCharIndex?: number;
    startDeleting?: boolean;
  }) {
    const {
      phrases,
      typingSpeed = 100,
      deletingSpeed = 60,
      delayBetweenPhrases = 2000,
      initialPhrase,
      initialCharIndex,
      startDeleting = false,
    } = config;

    const output = signal(initialPhrase ?? phrases[0]);
    let phraseIndex = 0;
    let charIndex = initialCharIndex ?? phrases[0].length;
    let isDeleting = startDeleting;
    let currentPhrases = [...phrases];

    const tick = () => {
      const currentPhrase = currentPhrases[phraseIndex];

      if (isDeleting) {
        output.set(currentPhrase.substring(0, charIndex - 1));
        charIndex--;
      } else {
        output.set(currentPhrase.substring(0, charIndex + 1));
        charIndex++;
      }

      let speed = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentPhrase.length) {
        speed = delayBetweenPhrases;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % currentPhrases.length;
        speed = 500;
      }

      this.timeoutId = setTimeout(tick, speed);
    };

    const start = (delay = 0) => {
      this.timeoutId = setTimeout(tick, delay);
    };

    const updatePhrases = (newPhrases: string[]) => {
      currentPhrases = [...newPhrases];
      phraseIndex = 0;
      charIndex = currentPhrases[0].length;
      isDeleting = true;
      output.set(currentPhrases[0]);
    };

    const destroy = () => {
      clearTimeout(this.timeoutId);
    };

    return { output, start, updatePhrases, destroy };
  }
}
