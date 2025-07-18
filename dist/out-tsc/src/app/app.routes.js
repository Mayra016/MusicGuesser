import { InfoComponentComponent } from './Information/InfoComponentComponent/info-component.component';
import { ConfigComponentComponent } from './Config/config-component/config-component.component';
import { HomeComponent } from './home/home.component';
export const routes = [
    { path: 'menu', component: HomeComponent },
    { path: 'play', loadComponent: () => import('./Game/play-component/play-component.component').then((m) => m.PlayComponentComponent),
        data: { skipPrerender: true } },
    { path: 'info', component: InfoComponentComponent },
    { path: 'config', component: ConfigComponentComponent },
    { path: '**', redirectTo: 'menu' }
];
