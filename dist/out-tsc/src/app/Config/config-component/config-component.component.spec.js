import { TestBed } from '@angular/core/testing';
import { ConfigComponentComponent } from './config-component.component';
describe('ConfigComponentComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfigComponentComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(ConfigComponentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
