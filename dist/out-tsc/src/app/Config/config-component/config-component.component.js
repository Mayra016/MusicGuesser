import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import textES from '../../translations/textES';
import textEN from '../../translations/textEN';
import textDE from '../../translations/textDE';
import textPT from '../../translations/textPT';
let ConfigComponentComponent = class ConfigComponentComponent {
    cookies;
    route;
    language = 'EN';
    volume = 50;
    graphics = 1;
    volIn = null;
    volOut = null;
    quality = "Quality: ";
    langDiv = null;
    qualities = [];
    languages = ['English', 'Spanish', 'Portuguese', 'German'];
    langIndex = 0;
    index = 1;
    volumeTxt = "Volume";
    languageTxt = "Language";
    saveTxt = "Save";
    menuTxt = "Menu";
    constructor(cookies, route) {
        this.cookies = cookies;
        this.route = route;
    }
    ngOnInit() {
        this.language = this.cookies.get("language") || this.route.snapshot.paramMap.get('lang') || 'EN';
        this.volume = Number(this.cookies.get("volume") || this.route.snapshot.paramMap.get('vol') || 50);
        this.graphics = Number(this.cookies.get("graphics") || this.route.snapshot.paramMap.get('graph') || 1);
        this.index = Math.max(0, Math.min(2, this.graphics));
        if (this.volume != 50) {
            this.cookies.set("volume", this.volume.toString());
        }
        this.translate();
    }
    ngAfterViewInit() {
        this.langDiv = document.getElementById("current-language");
        this.volIn = document.getElementById("vol-in");
        this.volOut = document.getElementById("vol-out");
    }
    translate() {
        if (this.language == 'ES' || this.language == 'Spanish') {
            this.qualities = textES.qualities;
            this.langIndex = 1;
            this.quality = textES.quality;
            this.volumeTxt = textES.volume;
            this.languageTxt = textES.language;
            this.saveTxt = textES.save;
            this.menuTxt = textES.menu;
        }
        else if (this.language == 'DE' || this.language == 'German') {
            this.qualities = textDE.qualities;
            this.langIndex = 3;
            this.quality = textDE.quality;
            this.volumeTxt = textDE.volume;
            this.languageTxt = textDE.language;
            this.saveTxt = textDE.save;
            this.menuTxt = textDE.menu;
        }
        else if (this.language == 'PT' || this.language == 'Portuguese') {
            this.qualities = textPT.qualities;
            this.langIndex = 2;
            this.quality = textPT.quality;
            this.volumeTxt = textPT.volume;
            this.languageTxt = textPT.language;
            this.saveTxt = textPT.save;
            this.menuTxt = textPT.menu;
        }
        else {
            this.qualities = textEN.qualities;
            this.langIndex = 0;
            this.quality = textEN.quality;
            this.volumeTxt = textEN.volume;
            this.languageTxt = textEN.language;
            this.saveTxt = textEN.save;
            this.menuTxt = textEN.menu;
        }
    }
    changeQuality(step) {
        if (this.index + step < 3 && this.index + step >= 0) {
            this.index = this.index + step;
        }
        else {
            if (this.index + step >= 3) {
                this.index = 0;
            }
            else {
                this.index = 3;
            }
        }
        this.graphics = this.index;
        this.cookies.set("graphics", String(this.graphics));
    }
    changeLanguage(step) {
        if (this.langIndex + step < 4 && this.langIndex + step >= 0) {
            this.langIndex = this.langIndex + step;
        }
        else {
            if (this.langIndex + step >= 3) {
                this.langIndex = 0;
            }
            else {
                this.langIndex = 3;
            }
        }
        this.language = this.languages[this.langIndex];
        this.cookies.set("language", this.language);
        this.translate();
    }
    onVolumeChange(newVolume) {
        this.volume = newVolume;
        this.cookies.set("volume", String(newVolume));
    }
};
ConfigComponentComponent = __decorate([
    Component({
        selector: 'app-config-component',
        standalone: true,
        imports: [FormsModule, RouterLink],
        templateUrl: './config-component.component.html',
        styleUrls: ['./config-component.component.css']
    })
], ConfigComponentComponent);
export { ConfigComponentComponent };
