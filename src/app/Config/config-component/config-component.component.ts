import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms'; 
import textES from '../../translations/textES';
import textEN from '../../translations/textEN';
import textDE from '../../translations/textDE';
import textPT from '../../translations/textPT';

@Component({
  selector: 'app-config-component',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './config-component.component.html',
  styleUrls: ['./config-component.component.css']
})
export class ConfigComponentComponent implements OnInit, AfterViewInit {

    language: string = 'EN';
    volume: number = 50;
    graphics: number = 1;
    volIn: HTMLInputElement | null = null;
    volOut: HTMLElement | null = null;

    quality: string = "Quality: ";
    langDiv: HTMLElement | null = null;
    qualities: string[] = [];
    languages: string[] = ['English', 'Spanish', 'Portuguese', 'German'];
    langIndex: number = 0;
    index: number = 1;
    volumeTxt: string = "Volume";
    languageTxt: string = "Language";
    saveTxt: string = "Save";
    menuTxt: string = "Menu";

    constructor(private cookies:CookieService, private route:ActivatedRoute, private router: Router,){}

    ngOnInit(): void {
        this.route.queryParamMap.subscribe(params => {
            const langParam = params.get('lang');
            const volParam = params.get('vol');
        
            this.language = langParam || localStorage.getItem("language") || 'EN';
            this.volume = volParam ? Number(volParam) : Number(localStorage.getItem("volume") || 50);
            this.graphics = Number(localStorage.getItem("graphics") || this.route.snapshot.paramMap.get('graph') || 1);
            this.index = Math.max(0, Math.min(2, this.graphics));
    
            if (this.volume != 50) {
                localStorage.setItem("volume", this.volume.toString());
            }
    
            this.translate();
        });

    }

    ngAfterViewInit(): void {
        
        this.langDiv = document.getElementById("current-language");
        this.volIn = document.getElementById("vol-in") as HTMLInputElement;
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
        } else if (this.language == 'DE' || this.language == 'German') {
            this.qualities = textDE.qualities;
            this.langIndex = 3;
            this.quality = textDE.quality;
            this.volumeTxt = textDE.volume;
            this.languageTxt = textDE.language;
            this.saveTxt = textDE.save;
            this.menuTxt = textDE.menu;
        } else if (this.language == 'PT' || this.language == 'Portuguese') {
            this.qualities = textPT.qualities;
            this.langIndex = 2;
            this.quality = textPT.quality;
            this.volumeTxt = textPT.volume;
            this.languageTxt = textPT.language;
            this.saveTxt = textPT.save;
            this.menuTxt = textPT.menu;
        } else {
            this.qualities = textEN.qualities;
            this.langIndex = 0;
            this.quality = textEN.quality;
            this.volumeTxt = textEN.volume;
            this.languageTxt = textEN.language;
            this.saveTxt = textEN.save;
            this.menuTxt = textEN.menu;
        }
    }

    changeQuality(step:number) {
        if (this.index + step < 3 && this.index + step >= 0) {
            this.index = this.index + step;
        } else {
            if (this.index + step >= 3) {
                this.index = 0;
            } else {
                this.index = 3;
            }
        }

        this.graphics = this.index;
       localStorage.setItem("graphics", String(this.graphics));
    }

    changeLanguage(step:number) {
        if (this.langIndex + step < 4 && this.langIndex + step >= 0) {
            this.langIndex = this.langIndex + step;
        } else {
            if (this.langIndex + step >= 3) {
                this.langIndex = 0;
            } else {
                this.langIndex = 3;
            }
        }
        this.language = this.languages[this.langIndex];
        localStorage.setItem("language", this.language);
        this.updateParams();
        this.translate();
    }

    onVolumeChange(newVolume: number) {
        this.volume = newVolume;
        localStorage.setItem("volume", String(newVolume));
        this.updateParams();
 
    }

    updateParams() {
        this.router.navigate([], {
            queryParams: {
              lang: this.language,
              vol: this.volume
            },
            queryParamsHandling: 'merge', 
          });
    }
}
