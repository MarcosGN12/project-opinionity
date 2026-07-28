import { Component } from '@angular/core';
import { AsideLeft } from './components/aside-left/aside-left-component';
import { Section } from './components/section/section-component';
import { AsideRight } from './components/aside-right/aside-right-component';

@Component({
  standalone: true,
  selector: 'feed',
  imports: [AsideLeft, Section, AsideRight],
  templateUrl: './feed.html',
  styleUrl: './feed.css',
})
export class Feed {
  toggleTheme() {}
}
