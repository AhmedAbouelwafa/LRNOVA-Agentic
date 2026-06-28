import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostListener,
  signal,
  computed,
  ElementRef,
  ViewChild,
  inject,
  ChangeDetectionStrategy,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit, OnDestroy, AfterViewInit {
  private router = inject(Router);
  private ngZone = inject(NgZone);

  @ViewChild('loginCard') loginCard!: ElementRef<HTMLDivElement>;

  // Theme
  isDarkMode = signal(true);

  // Form
  name = signal('');
  email = signal('');
  password = signal('');
  rememberMe = signal(false);
  showPassword = signal(false);
  isLoading = signal(false);
  nameFocused = signal(false);
  emailFocused = signal(false);
  passwordFocused = signal(false);
  nameTouched = signal(false);
  emailTouched = signal(false);
  passwordTouched = signal(false);

  // Mouse parallax for card
  cardRotateX = signal(0);
  cardRotateY = signal(0);
  isReady = signal(false);

  private mouseRafId: number | null = null;
  private targetRotateX = 0;
  private targetRotateY = 0;

  ngOnInit(): void {
    this.applyTheme();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.isReady.set(true), 100);
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        this.cardRotateX.update((v) => v + (this.targetRotateX - v) * 0.08);
        this.cardRotateY.update((v) => v + (this.targetRotateY - v) * 0.08);
        this.mouseRafId = requestAnimationFrame(animate);
      };
      this.mouseRafId = requestAnimationFrame(animate);
    });
  }

  ngOnDestroy(): void {
    if (this.mouseRafId) cancelAnimationFrame(this.mouseRafId);
  }

  ensureMuted(event: Event): void {
    const video = event.target as HTMLVideoElement;
    video.muted = true;
    video.volume = 0;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;
    this.targetRotateY = x * 2;
    this.targetRotateX = -y * 2;
  }

  @HostListener('document:contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    if ((event.target as HTMLElement).tagName === 'VIDEO') event.preventDefault();
  }



  private applyTheme(): void {
    if (this.isDarkMode()) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  getCardTransform(): string {
    return `perspective(1200px) rotateX(${this.cardRotateX()}deg) rotateY(${this.cardRotateY()}deg)`;
  }

  onSubmit(): void {
    this.nameTouched.set(true);
    this.emailTouched.set(true);
    this.passwordTouched.set(true);
    if (!this.name() || !this.email() || !this.password()) return;
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/']);
    }, 2000);
  }

  onSocialLogin(provider: string): void {
    console.log(`Register with ${provider}`);
  }

  isNameValid(): boolean {
    if (!this.nameTouched()) return true;
    return this.name().trim().length > 1;
  }

  isEmailValid(): boolean {
    if (!this.emailTouched()) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email());
  }

  isPasswordValid(): boolean {
    if (!this.passwordTouched()) return true;
    return this.password().length >= 6;
  }
}
