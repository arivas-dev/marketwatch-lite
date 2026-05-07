import { Component, model } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  templateUrl: './search-bar.component.html',
})
export class SearchBarComponent {
  readonly query = model('');

  protected onInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    this.query.set(el.value);
  }
}
