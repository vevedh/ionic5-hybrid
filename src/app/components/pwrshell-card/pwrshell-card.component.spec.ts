import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PwrshellCardComponent } from './pwrshell-card.component';

describe('PwrshellCardComponent', () => {
  let component: PwrshellCardComponent;
  let fixture: ComponentFixture<PwrshellCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PwrshellCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PwrshellCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
