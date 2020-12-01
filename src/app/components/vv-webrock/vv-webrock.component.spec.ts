import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VvWebrockComponent } from './vv-webrock.component';

describe('VvWebrockComponent', () => {
  let component: VvWebrockComponent;
  let fixture: ComponentFixture<VvWebrockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VvWebrockComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VvWebrockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
