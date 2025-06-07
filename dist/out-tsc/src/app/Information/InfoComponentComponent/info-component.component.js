import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import textEN from '../../translations/textEN';
import textES from '../../translations/textES';
import textDE from '../../translations/textDE';
import textPT from '../../translations/textPT';
let InfoComponentComponent = class InfoComponentComponent {
    cookies;
    route;
    constructor(cookies, route) {
        this.cookies = cookies;
        this.route = route;
    }
    ;
    menuTxt = textEN.menu;
    YTLINK = textEN.YTLINK;
    volume = 50;
    language = "EN";
    ngOnInit() {
        this.language = this.cookies.get("language") || this.route.snapshot.paramMap.get('lang') || 'EN';
        this.volume = Number(this.cookies.get("volume") || this.route.snapshot.paramMap.get('vol') || 50);
        this.translate();
    }
    translate() {
        if (this.language == 'ES' || this.language == 'Spanish') {
            this.menuTxt = textES.menu;
            this.YTLINK = textES.YTLINK;
        }
        else if (this.language == 'DE' || this.language == 'German') {
            this.menuTxt = textDE.menu;
            this.YTLINK = textDE.YTLINK;
        }
        else if (this.language == 'PT' || this.language == 'Portuguese') {
            this.menuTxt = textPT.menu;
            this.YTLINK = textPT.YTLINK;
        }
        else {
        }
    }
};
InfoComponentComponent = __decorate([
    Component({
        selector: 'app-info-component',
        imports: [RouterLink],
        templateUrl: './info-component.component.html',
        styleUrl: './info-component.component.css'
    })
], InfoComponentComponent);
export { InfoComponentComponent };
