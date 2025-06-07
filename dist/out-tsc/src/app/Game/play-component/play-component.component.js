import { __decorate } from "tslib";
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import textEN from '../../translations/textEN';
import textDE from '../../translations/textDE';
import textES from '../../translations/textES';
import textPT from '../../translations/textPT';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { environment } from '../../../environments/environment.prod';
//import { geniusProxy } from '../../../../functions/src/genius-proxy';
let PlayComponentComponent = class PlayComponentComponent {
    cookies;
    route;
    httpClient;
    sanitizer;
    constructor(cookies, route, httpClient, sanitizer) {
        this.cookies = cookies;
        this.route = route;
        this.httpClient = httpClient;
        this.sanitizer = sanitizer;
        this.translate();
        this.generateLetters();
        this.musicVideoSrc = this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
    // local variables
    language = 'EN';
    letters = "";
    availableLetters = "ABCDEFGHIJKLMNOPQRSTUVWXZ";
    userWord = "";
    music = "";
    lyrics = "";
    autocompleteApiURL = environment.production
        ? '/genius-api/search'
        : 'http://localhost:5001/YOUR-PROJECT/us-central1/geniusProxy/search'; //"/genius-api/search?q=";
    lyricsApiUrl = "https://api.lyrics.ovh/v1";
    autocompleteResult = {};
    songs = [];
    won = false;
    lost = false;
    score = 0;
    lifes = 3;
    minutes = "00";
    seconds = 60;
    animationState = 'none';
    musicVideo = false;
    musicVideoSrc;
    Array = Array;
    // translations
    titleTxt = textEN.gameTitle;
    wordTxt = textEN.wordTxt;
    sendTxt = textEN.send;
    scoreTxt = "Score:";
    winTxt = textEN.win;
    nextTxt = textEN.next;
    lostTxt = textEN.lostTitle;
    lostScore = textEN.scoreText;
    playAgainTxt = textEN.playAgain;
    songTxt = textEN.songTxt;
    surrenderTxt = textEN.surrenderTxt;
    ngOnInit() {
        this.language = this.cookies.get("language") || this.route.snapshot.paramMap.get('lang') || 'EN';
        this.translate();
        this.timer();
    }
    async timer() {
        while (this.seconds > 0) {
            if (this.seconds <= 10) {
                this.animationState = 'shake';
            }
            else {
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
        }
        else {
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
        }
        else if (this.language == 'DE' || this.language == 'German') {
            this.titleTxt = textDE.gameTitle;
            this.wordTxt = textDE.wordTxt;
            this.sendTxt = textDE.send;
            this.scoreTxt = textDE.score;
            this.winTxt = textDE.win;
            this.nextTxt = textDE.next;
            this.lostTxt = textDE.lostTitle;
            this.lostScore = textDE.scoreText;
            this.playAgainTxt = textDE.playAgain;
            this.songTxt = textES.songTxt;
            this.surrenderTxt = textDE.surrenderTxt;
        }
        else if (this.language == 'PT' || this.language == 'Portuguese') {
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
        }
        else {
        }
    }
    // generate letters
    generateLetters() {
        this.letters += this.availableLetters.charAt(Math.floor((Math.random() * this.availableLetters.length)));
        this.letters += this.availableLetters.charAt(Math.floor((Math.random() * this.availableLetters.length)));
    }
    selectedSong(selectedSong) {
        let link = this.generateLinkToLyricsAPI(selectedSong);
        this.getLyrics(link);
    }
    generateLinkToLyricsAPI(answer) {
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
    getLyrics(link, callback) {
        this.httpClient.get(link).subscribe({
            next: (response) => {
                this.lyrics = response.lyrics;
                console.log("HOLAAA" + this.lyrics);
            },
            error: (err) => {
                this.music = "";
                alert("Song not found!");
            }
        });
    }
    autocomplete(music) {
        if (!music || music.trim() === '') {
            this.songs = [];
            return;
        }
        this.httpClient.get(`${this.autocompleteApiURL}${encodeURIComponent(music)}`)
            .subscribe({
            next: (response) => {
                console.log('API Response:', response["response"]["hits"][0]); // Debug log
                this.songs = response?.response?.hits?.map((item) => {
                    let song = item.result.title + " by " + item.result.artist_names;
                    if (song.endsWith(" by Najwa")) {
                        song = song.replace("Najwa", "Najwa Nimri");
                    }
                    return song;
                }) || [];
            },
            error: (err) => {
                console.error('API Error:', err);
                this.songs = [];
            }
        });
    }
    checkUserInput() {
        this.userWord = this.userWord.split(" ")[0].toUpperCase();
        this.lyrics = this.lyrics.toUpperCase();
        console.log("SCORE ANTES" + this.userWord);
        if (this.lyrics == "") {
            let link = this.generateLinkToLyricsAPI(this.music);
            this.getLyrics(link, () => {
                this.runChecks();
            });
        }
        else {
            this.runChecks();
        }
    }
    async searchVideo() {
        console.log("SEARCHING VIDEO");
        let answer = this.music;
        answer = answer.replace(/\s+/g, " ").trim();
        let lastByIndex = answer.lastIndexOf(" by ");
        let song = answer.substring(0, lastByIndex).trim().replace(/ /g, "-");
        let artist = answer.substring(lastByIndex + 4).trim().replace(/ /g, "-");
        let songFormated = artist + song;
        let apiKey = "AIzaSyBJnRvYAq8_-a5EfbVdHhMRCbBEBc2VatI";
        console.log(songFormated);
        let googleApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${songFormated}&key=${apiKey}`;
        const response = await fetch(googleApiUrl);
        const data = await response.json();
        if (data.items.length > 0) {
            const videoId = data.items[0].id.videoId;
            if (this.sanitizer) { // Add this check
                this.musicVideoSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?autoplay=0`);
                console.log(this.musicVideoSrc);
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
        }
        else {
            this.lifes = this.lifes - 1;
            if (this.lifes == 0) {
                this.lost = true;
                this.score = 0;
            }
        }
        console.log("SCORE DESPUÉS" + this.score);
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
};
PlayComponentComponent = __decorate([
    Component({
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
], PlayComponentComponent);
export { PlayComponentComponent };
