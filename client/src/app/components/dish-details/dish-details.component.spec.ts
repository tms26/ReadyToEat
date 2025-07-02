import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from '../navbar/navbar.component';
import { DishDetailsComponent } from './dish-details.component';

describe('DishDetailsComponent', () => {
  let component: DishDetailsComponent;
  let fixture: ComponentFixture<DishDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DishDetailsComponent, NavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DishDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
