import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Injectable,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

export type ThemeMode = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'mwl-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _mode = signal<ThemeMode>(this.readStoredOrSystem());

  readonly mode = this._mode.asReadonly();
  readonly isDark = computed(() => this._mode() === 'dark');

  constructor() {
    effect(() => {
      const mode = this._mode();
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      this.applyToDocument(mode);
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    });
  }

  setMode(mode: ThemeMode): void {
    this._mode.set(mode);
  }

  toggle(): void {
    this._mode.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  private readStoredOrSystem(): ThemeMode {
    if (!isPlatformBrowser(this.platformId)) {
      return 'light';
    }
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  private applyToDocument(mode: ThemeMode): void {
    const root = this.document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
