import { NgClass } from '@angular/common';
import {
  Component,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';

import { ThemeService } from '../../../core/theme/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly theme = inject(ThemeService);

  readonly mobileMenuOpen = signal(false);
  readonly isDark = computed(() => this.theme.isDark());

  toggleTheme(): void {
    this.theme.toggle();
  }

  setThemeLight(): void {
    this.theme.setMode('light');
  }

  setThemeDark(): void {
    this.theme.setMode('dark');
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMobileMenu();
  }
}
