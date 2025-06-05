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
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-play-component',
  standalone: true,
  imports: [BrowserModule, FormsModule, CommonModule, RouterOutlet, RouterLink],
  templateUrl: './play-component.component.html',
  styleUrls: ['./play-component.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('0.3s ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ]
})
export class PlayComponentComponent {
  constructor(private cookies:CookieService, private route:ActivatedRoute, private httpClient:HttpClient){
    this.translate();
    this.generateLetters();
  }
  // local variables
  language: string = 'EN';
  letters: string = "";
  availableLetters: string = "ABCDEFGHIJKLMNOPQRSTUVWXZ";
  userWord: string = "";
  music: string = "";
  lyrics: string = "";
  autocompleteApiURL: string = "/genius-api/search?q=";
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
  songTxt: string = textEN.songTxt;
  

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
    let link = this.generateLinkToLyricsAPI(selectedSong);
    this.getLyrics(link);
  }

  generateLinkToLyricsAPI(answer:string) {
    this.music = answer;
    answer = answer.replace(/\s+/g, " ").trim();
    let lastByIndex = answer.lastIndexOf(" by ");
    let song = answer.substring(0, lastByIndex).trim().replace(/ /g, "-");
    let artist = answer.substring(lastByIndex + 4).trim().replace(/ /g, "-"); 
    console.log("MÚSICA 0 " + artist);
    console.log("MÚSICA 1 " + song);
    console.log("LINK " + `${this.lyricsApiUrl}/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`);
    
    return `${this.lyricsApiUrl}/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`;
  }

  // fetch lyrics api
  getLyrics(link:string) {
    this.httpClient.get(link).subscribe({
      next: (response: any) => {
        this.lyrics = response.lyrics;
        console.log("HOLAAA" + this.lyrics);
      },
      error: (err) =>  alert("Song not found!")
    });
  }

  autocomplete(music: string) {
    if (!music || music.trim() === '') {
      this.songs = [];
      return;
    }
  
    this.httpClient.get<any>(`${this.autocompleteApiURL}${encodeURIComponent(music)}`)
      .subscribe({
        next: (response) => {
          console.log('API Response:', response["response"]["hits"][0]); // Debug log
          this.songs = response?.response?.hits?.map(
            (item: any) =>  {
              let song = item.result.title + " by " + item.result.artist_names;
                if (song.endsWith(" by Najwa")) {
                  song = song.replace("Najwa", "Najwa Nimri");
                }
                return song;
            } 
          ) || [];
        },
        error: (err) => {
          console.error('API Error:', err);
          this.songs = [];
        }
      });
  }

  checkUserInput() {
    this.userWord = this.userWord.toUpperCase();
    this.lyrics = this.lyrics.toUpperCase();
    console.log("SCORE ANTES" + this.score);
    if (this.lyrics == "") {
      let link = this.generateLinkToLyricsAPI(this.music);
      this.getLyrics(link);
    }
    if (!this.userWord.includes(this.letters.charAt(0)) || !this.userWord.includes(this.letters.charAt(1))) {
      alert("The word doesn't contain the letters");
    }
    if (!this.lyrics.includes(this.userWord)) {
      alert("The lyrics doesn't contain the word");
    }
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
    console.log("SCORE ANTES" + this.score);
  }

  nextLevel() {
    this.won = false;
    this.resetLevel();
  }

  playAgain() {
    this.lost = false;
    this.resetLevel();
    this.score = 0;
    this.lifes = 3
  }

  resetLevel() {
    this.userWord = "";
    this.music = "";
    this.lyrics = "";
    this.letters = "";
    this.songs = [];
    this.autocompleteResult = {};
    this.generateLetters();
  }
}
