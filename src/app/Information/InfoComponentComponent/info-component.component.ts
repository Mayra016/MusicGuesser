import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import textEN from '../../translations/textEN';
import { CookieService } from 'ngx-cookie-service';
import textES from '../../translations/textES';
import textDE from '../../translations/textDE';
import textPT from '../../translations/textPT';

@Component({
  selector: 'app-info-component',
  imports: [RouterLink],
  templateUrl: './info-component.component.html',
  styleUrl: './info-component.component.css'
})
export class InfoComponentComponent {
  constructor(private cookies:CookieService, private route:ActivatedRoute) {};

  menuTxt: string = textEN.menu;
  YTLINK: string = textEN.YTLINK;
  volume: number = 50;
  language: string = "EN";
  

  ngOnInit(): void {
    this.language = localStorage.getItem("language") || this.route.snapshot.paramMap.get('lang') || 'EN';
    this.volume = Number(localStorage.getItem("volume") || this.route.snapshot.paramMap.get('vol') || 50);

    this.translate();
  }

  translate() {
    if (this.language == 'ES' || this.language == 'Spanish') {
      this.menuTxt = textES.menu;
      this.YTLINK = textES.YTLINK;
    } else if (this.language == 'DE' || this.language == 'German') {
      this.menuTxt = textDE.menu;
      this.YTLINK = textDE.YTLINK;
    } else if (this.language == 'PT' || this.language == 'Portuguese') {
      this.menuTxt = textPT.menu;
      this.YTLINK = textPT.YTLINK;
    } else {
    }
  }
}
