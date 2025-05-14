import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import textEN from '../../translations/textEN';
import { CookieService } from 'ngx-cookie-service';
import textDE from '../../translations/textDE';
import textES from '../../translations/textES';
import textPT from '../../translations/textPT';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-play-component',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink],
  templateUrl: './play-component.component.html',
  styleUrls: ['./play-component.component.css']
})
export class PlayComponentComponent {
  constructor(private cookies:CookieService, private route:ActivatedRoute){
    this.translate;
    this.generateLetters;
  }
  // local variables
  language: string = 'EN';
  letters: string = "";
  availableLetters: string = "ABCDEFGHIJKLMNOPQRSTUVWXZ";
  userWord: string = "";
  music: string = "";
  lyrics: string = "";
  

  // translations
  titleTxt: string = textEN.gameTitle;
  wordTxt: string = textEN.wordTxt;
  sendTxt: string = textEN.send;
  

  ngOnInit(): void {
    this.language = this.cookies.get("language") || this.route.snapshot.paramMap.get('lang') || 'EN';
  }


  translate() {
    if (this.language == 'ES' || this.language == 'Spanish') {
      this.titleTxt = textES.gameTitle;
      this.wordTxt = textES.wordTxt;
      this.sendTxt = textES.send;
    } else if (this.language == 'DE' || this.language == 'German') {
      this.titleTxt = textDE.gameTitle;
      this.wordTxt = textDE.wordTxt;
      this.sendTxt = textDE.send;

    } else if (this.language == 'PT' || this.language == 'Portuguese') {
      this.titleTxt = textPT.gameTitle;
      this.wordTxt = textPT.wordTxt;
    } else {

    }
  }  

  // generate letters
  generateLetters() {
    this.letters += this.availableLetters.charAt(Math.floor((Math.random() * this.availableLetters.length) + 1));
    this.letters += this.availableLetters.charAt(Math.floor((Math.random() * this.availableLetters.length - 4) + 1));
  }

  // check user input


  autocomplete(music: string) {
    // fetch api
  }
}
