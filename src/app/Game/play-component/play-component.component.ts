import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import textEN from '../../translations/textEN';
import { CookieService } from 'ngx-cookie-service';
import textDE from '../../translations/textDE';
import textES from '../../translations/textES';
import textPT from '../../translations/textPT';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-play-component',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet, RouterLink],
  templateUrl: './play-component.component.html',
  styleUrls: ['./play-component.component.css']
})
export class PlayComponentComponent {
  constructor(private cookies:CookieService, private route:ActivatedRoute, private httpClient:HttpClient){
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
  autocompleteApiURL: string = "api.genius.com/search?q=";
  lyricsApiUrl: string = "https://api.lyrics.ovh/v1";
  autocompleteResult = {};
  songs: string[] = [];
  won: boolean = false;
  lost: boolean = false;
  score: number = 0;
  lifes: number = 3;
  Array = Array;


  // translations
  titleTxt: string = textEN.gameTitle;
  wordTxt: string = textEN.wordTxt;
  sendTxt: string = textEN.send;
  scoreTxt: string = "Score:";
  winTxt: string = textEN.win;
  nextTxt: string = textEN.next;
  lostTxt: string = textEN.lostTitle;
  lostScore: string = textEN.scoreText;
  playAgainTxt: string = textEN.playAgain;
  

  ngOnInit(): void {
    this.language = this.cookies.get("language") || this.route.snapshot.paramMap.get('lang') || 'EN';
  }


  translate() {
    if (this.language == 'ES' || this.language == 'Spanish') {
      this.titleTxt = textES.gameTitle;
      this.wordTxt = textES.wordTxt;
      this.sendTxt = textES.send;
      this.scoreTxt = textES.score;
      this.winTxt = textES.win;
      this.nextTxt = textES.next;
      this.lostTxt = textES.lostTitle;
      this.lostScore = textES.scoreText;
      this.playAgainTxt = textES.playAgain;

    } else if (this.language == 'DE' || this.language == 'German') {
      this.titleTxt = textDE.gameTitle;
      this.wordTxt = textDE.wordTxt;
      this.sendTxt = textDE.send;
      this.scoreTxt = textDE.score;
      this.winTxt = textDE.win;
      this.nextTxt = textDE.next;
      this.lostTxt = textDE.lostTitle;
      this.lostScore = textDE.scoreText;
      this.playAgainTxt = textDE.playAgain;

    } else if (this.language == 'PT' || this.language == 'Portuguese') {
      this.titleTxt = textPT.gameTitle;
      this.wordTxt = textPT.wordTxt;
      this.sendTxt = textPT.send;
      this.scoreTxt = textPT.score;
      this.winTxt = textPT.win;
      this.nextTxt = textPT.next;
      this.lostTxt = textPT.lostTitle;
      this.lostScore = textPT.scoreText;
      this.playAgainTxt = textPT.playAgain;
    } else {

    }
  }  

  // generate letters
  generateLetters() {
    this.letters += this.availableLetters.charAt(Math.floor((Math.random() * this.availableLetters.length) + 1));
    this.letters += this.availableLetters.charAt(Math.floor((Math.random() * this.availableLetters.length - 4) + 1));
  }

  selectedSong(selectedSong:string) {
    this.music = selectedSong;
    let userInput = selectedSong.split(" by ");
    // fetch lyrics api
    this.lyrics = String(this.httpClient.get(this.lyricsApiUrl + "/" + selectedSong[1] + "/" + selectedSong[0]));
  }

  autocomplete(music: string) {
    // fetch autocomplete Genius Api
    const headers: HttpHeaders = new HttpHeaders();
    headers.set("Authorization:", "Bearer -riMsB6htPjCj--rQmpY4EyFTwRViRwcOgmnaBhUfOENWwrZVbBGP5sFB1RH6xcE");
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    this.httpClient.get<any>(this.autocompleteApiURL + music, { headers }).subscribe({
      next: (response) => {
        this.songs = response?.response?.hits?.result?.map(
          (item: any) => item.full_title
        ) || [];
        
      },
      error: (err) => console.error('Error:', err)
    });
  }

  checkUserInput() {
    this.userWord = this.userWord.toUpperCase();

    if (this.userWord.includes(this.letters.charAt(0)) &&
       this.userWord.includes(this.letters.charAt(1)) &&
       this.lyrics.includes(this.userWord)) {
      this.won = true;
      this.score += 10;
    } else {
      this.lifes = this.lifes - 1;
      if (this.lifes == 0) {
        this.lost = true;
        this.score = 0;    
      }   
    }

  }

  nextLevel() {
    this.resetLevel;
    this.won = false;
  }

  playAgain() {
    this.resetLevel;
    this.lost = false;
    this.score = 0;
    this.lifes = 3
  }

  resetLevel() {
    this.userWord = "";
    this.music = "";
    this.lyrics = "";
    this.songs = [];
    this.autocompleteResult = {};
    this.generateLetters;
  }
}
