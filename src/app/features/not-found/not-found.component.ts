import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  host: {
    class: 'flex min-h-0 w-full flex-1 flex-col',
  },
})
export class NotFoundComponent {}
