import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import textEN from '../../translations/textEN';
import { CookieService } from 'ngx-cookie-service';
import textDE from '../../translations/textDE';
import textES from '../../translations/textES';
import textPT from '../../translations/textPT';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-play-component',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './play-component.component.html',
  styleUrls: ['./play-component.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('0.5s ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ]),
    trigger('shakeAnimation', [
      transition('* => shake', [
        animate('15s', keyframes([
          style({ transform: 'translate(2px, 2px) rotate(0deg)', offset: 0 }),
          style({ transform: 'translate(-2px, -2px) rotate(-1deg)', offset: 0.05 }),
          style({ transform: 'translate(-4px, 0px) rotate(1deg)', offset: 0.1 }),
          style({ transform: 'translate(4px, 2px) rotate(0deg)', offset: 0.15 }),
          style({ transform: 'translate(2px, -2px) rotate(1deg)', offset: 0.2 }),
          style({ transform: 'translate(-2px, 3px) rotate(-1deg)', offset: 0.25 }),
          style({ transform: 'translate(-4px, 1px) rotate(0deg)', offset: 0.3 }),
          style({ transform: 'translate(4px, 1px) rotate(-1deg)', offset: 0.35 }),
          style({ transform: 'translate(-2px, -3px) rotate(1deg)', offset: 0.4 }),
          style({ transform: 'translate(2px, 3px) rotate(0deg)', offset: 0.45 }),
          style({ transform: 'translate(2px, -1px) rotate(-1deg)', offset: 0.5 }),
          style({ transform: 'translate(-2px, 1px) rotate(1deg)', offset: 0.55 }),
          style({ transform: 'translate(4px, -2px) rotate(0deg)', offset: 0.6 }),
          style({ transform: 'translate(-4px, 2px) rotate(-1deg)', offset: 0.65 }),
          style({ transform: 'translate(3px, 0px) rotate(1deg)', offset: 0.7 }),
          style({ transform: 'translate(-3px, -2px) rotate(0deg)', offset: 0.75 }),
          style({ transform: 'translate(3px, 1px) rotate(-1deg)', offset: 0.8 }),
          style({ transform: 'translate(-3px, 3px) rotate(1deg)', offset: 0.85 }),
          style({ transform: 'translate(1px, -1px) rotate(0deg)', offset: 0.9 }),
          style({ transform: 'translate(-1px, 2px) rotate(-1deg)', offset: 0.95 }),
          style({ transform: 'translate(2px, -2px) rotate(0deg)', offset: 1 }),
        ]))
      ])
    ])
  ]

})
export class PlayComponentComponent {
  
  constructor(private cookies:CookieService, private route:ActivatedRoute, private httpClient:HttpClient, private sanitizer: DomSanitizer){
    this.translate();
    this.generateLetters();
    this.musicVideoSrc = this.sanitizer.bypassSecurityTrustResourceUrl(''); 
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
  minutes: string = "00";
  seconds: number = 60;
  animationState: string = 'none';
  musicVideo: boolean = false;
  musicVideoSrc!: SafeResourceUrl;
  volume: number = 50;
  
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
  surrenderTxt: string = textEN.surrenderTxt;
  

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
    this.translate();
    this.timer();
    
  }

  async timer() {
    while (this.seconds > 0) {
      if (this.seconds <= 10) {
        this.animationState = 'shake';
      } else {
        this.animationState = 'none';
      }      
      this.seconds--;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    if (this.lifes > 1) {
      this.lifes--;
      this.animationState = 'none';
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.seconds = 10;
      this.timer();
    } else {
      this.lost = true;
    }
    
    
    
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
      this.songTxt = textES.songTxt;
      this.surrenderTxt = textES.surrenderTxt;

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
      this.songTxt = textDE.songTxt;
      this.surrenderTxt = textDE.surrenderTxt;

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
      this.songTxt = textES.songTxt;
      this.surrenderTxt = textPT.surrenderTxt;
    } else {

    }
  }  

  // generate letters
  generateLetters() {
    this.letters += this.availableLetters.charAt(Math.floor((Math.random() * this.availableLetters.length)));
    let newLetter = this.availableLetters.charAt(Math.floor((Math.random() * this.availableLetters.length)));
    while (this.letters.includes(newLetter)) {
      newLetter = this.availableLetters.charAt(Math.floor((Math.random() * this.availableLetters.length)));
    }
    this.letters += newLetter;
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

    return `${this.lyricsApiUrl}/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`;
  }

  // fetch lyrics api 
  /*
  async getLyrics(link:string, callback?: Function) {
    this.httpClient.get(link).subscribe({
      next: (response: any) => {
        this.lyrics = response.lyrics;
        console.log("HOLAAA" + this.lyrics);
      },
      error: (err) =>  {
        this.music = "";
        alert("Song not found!");
      }
    });
  }*/

  async getLyrics(link: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(link).subscribe({
        next: (response: any) => {
          this.lyrics = response.lyrics.toUpperCase();
          resolve();
        },
        error: (err) => {
          this.music = "";
          alert("Song not found!");
          reject(err);
        }
      });
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
          this.songs = [];
        }
      });
  }

  @HostListener('document:keydown.enter', ['$event'])
  handleEnter(event: KeyboardEvent) {
    if (!this.won && !this.lost) {
      this.checkUserInput();
    }
    if (this.won && !this.lost) {
      this.nextLevel();
    }
    if (!this.won && this.lost) {
      this.playAgain();
    }
    
  }

  async checkUserInput() {
    this.userWord = this.userWord.split(" ")[0].toUpperCase();
    this.lyrics = this.lyrics.toUpperCase();

    if (this.lyrics === "") {
      const link = this.generateLinkToLyricsAPI(this.music);
      try {
        await this.getLyrics(link);
      } catch (err) {
        return; 
      }
    }
    this.runChecks();
  }

  async searchVideo() {
    let answer = this.music;
    answer = answer.replace(/\s+/g, " ").trim();
    let lastByIndex = answer.lastIndexOf(" by ");
    let song = answer.substring(0, lastByIndex).trim().replace(/ /g, "-");
    let artist = answer.substring(lastByIndex + 4).trim().replace(/ /g, "-"); 
    let songFormated = artist + song;
    let apiKey = "AIzaSyBJnRvYAq8_-a5EfbVdHhMRCbBEBc2VatI";

    let googleApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${songFormated}&key=${apiKey}`;
    const response = await fetch(googleApiUrl);
    const data = await response.json();

    if (data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      if (this.sanitizer) {  
        this.musicVideoSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?autoplay=0`);

        this.musicVideo = true;
      }
    }
  }

  runChecks() {
    if (!this.userWord.includes(this.letters.charAt(0)) || !this.userWord.includes(this.letters.charAt(1))) {
      alert("The word doesn't contain the letters");
    }

    if (!this.lyrics.includes(this.userWord)) {
      alert("The lyrics doesn't contain the word");
    }

    if (this.userWord.includes(this.letters.charAt(0)) &&
        this.userWord.includes(this.letters.charAt(1)) &&
        this.lyrics.includes(this.userWord)) {
      this.searchVideo();
      this.won = true;
      this.score += 10;
      this.seconds = 60;
    } else {
      this.lifes = this.lifes - 1;
      if (this.lifes == 0) {
        this.lost = true;
        this.score = 0;    
      }   
    }

  }

  nextLevel() {
    this.won = false;
    this.resetLevel();
  }

  playAgain() {
    this.lost = false;
    this.resetLevel();
    this.score = 0;
    this.lifes = 3;
    this.musicVideo = false;
    this.timer();
  }

  resetLevel() {
    this.userWord = "";
    this.music = "";
    this.lyrics = "";
    this.letters = "";
    this.songs = [];
    this.autocompleteResult = {};
    this.seconds = 60;
    this.generateLetters();
  }
}
