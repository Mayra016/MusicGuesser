import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {Router, Event, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgIf } from '@angular/common';
import textEN from '../translations/textEN';
import textES from '../translations/textES';
import textDE from '../translations/textDE';
import textPT from '../translations/textPT';

@Component({
  selector: 'app-home',
  imports: [NgIf, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'MusicGuesser';
  showMenu = true;
  language :string = "EN";
  volume: number = 50;

  playTxt :string = textEN.playTxt;
  infoTxt :string = textEN.infoTxt;
  configTxt :string = textEN.configTxt;

  constructor(private cookies:CookieService, private route:ActivatedRoute, private router:Router) {
    this.router.events
      .pipe(
        filter((event: Event): event is NavigationStart => event instanceof NavigationStart)
      )
      .subscribe((event: NavigationStart) => {
        this.showMenu = event.url === '/';
      });
      console.log("show menu", this.showMenu);
  } 

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const langParam = params.get('lang');
      const volParam = params.get('vol');
  
      this.language = langParam || localStorage.getItem("language") || 'EN';
      this.volume = volParam ? Number(volParam) : Number(localStorage.getItem("volume") || 50);
  
      localStorage.setItem("language", this.language);
      localStorage.setItem("volume", this.volume.toString());
      this.translate();
    });
  }

  translate() {
    if (this.language == "ES" || this.language == "Spanish") {
      this.playTxt = textES.playTxt;
      this.infoTxt = textES.infoTxt;
      this.configTxt = textES.configTxt;
    }
    if (this.language == "DE" || this.language == "German") {
      this.playTxt = textDE.playTxt;
      this.infoTxt = textDE.infoTxt;
      this.configTxt = textDE.configTxt;
    }
    if (this.language == "PT" || this.language == "Portuguese") {
      this.playTxt = textPT.playTxt;
      this.infoTxt = textPT.infoTxt;
      this.configTxt = textPT.configTxt;
    }
  }

}