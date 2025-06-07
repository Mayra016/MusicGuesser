import { TestBed } from '@angular/core/testing';
import { InfoComponentComponent } from './info-component.component';
describe('InfoComponentComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InfoComponentComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(InfoComponentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
