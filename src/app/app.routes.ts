import { Routes } from '@angular/router';
import { PlayComponentComponent } from './Game/play-component/play-component.component';
import { InfoComponentComponent } from './Information/InfoComponentComponent/info-component.component';
import { ConfigComponentComponent } from './Config/config-component/config-component.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: 'menu', component: HomeComponent },
    { path: 'play', component: PlayComponentComponent },
    { path: 'info', component: InfoComponentComponent },
    { path: 'config', component: ConfigComponentComponent },
    { path: '**', redirectTo: 'menu' }
  ];
