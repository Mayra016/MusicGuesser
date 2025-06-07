import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgIf } from '@angular/common';
import textEN from '../translations/textEN';
import textES from '../translations/textES';
import textDE from '../translations/textDE';
import textPT from '../translations/textPT';
let HomeComponent = class HomeComponent {
    cookies;
    route;
    router;
    title = 'MusicGuesser';
    showMenu = true;
    language = "EN";
    volume = 50;
    playTxt = textEN.playTxt;
    infoTxt = textEN.infoTxt;
    configTxt = textEN.configTxt;
    constructor(cookies, route, router) {
        this.cookies = cookies;
        this.route = route;
        this.router = router;
        this.router.events
            .pipe(filter((event) => event instanceof NavigationStart))
            .subscribe((event) => {
            this.showMenu = event.url === '/';
        });
        console.log("show menu", this.showMenu);
    }
    ngAfterViewInit() {
    }
    ngOnInit() {
        this.language = this.cookies.get("language") || this.route.snapshot.paramMap.get('lang') || 'EN';
        this.volume = Number(this.cookies.get("volume") || this.route.snapshot.paramMap.get('vol') || 50);
        this.translate();
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
};
HomeComponent = __decorate([
    Component({
        selector: 'app-home',
        imports: [NgIf, RouterLink],
        templateUrl: './home.component.html',
        styleUrl: './home.component.css'
    })
], HomeComponent);
export { HomeComponent };
