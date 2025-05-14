import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {Router, Event, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [NgIf, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'MusicGuesser';
  showMenu = true;

  constructor(private router:Router) {
    this.router.events
      .pipe(
        filter((event: Event): event is NavigationStart => event instanceof NavigationStart)
      )
      .subscribe((event: NavigationStart) => {
        this.showMenu = event.url === '/';
      });
      console.log("show menu", this.showMenu);
  } 

}