import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BaseLayout } from '@core/components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BaseLayout],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
