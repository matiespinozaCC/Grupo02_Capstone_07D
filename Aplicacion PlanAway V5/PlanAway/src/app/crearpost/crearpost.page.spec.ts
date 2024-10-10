import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearpostPage } from './crearpost.page';

describe('CrearpostPage', () => {
  let component: CrearpostPage;
  let fixture: ComponentFixture<CrearpostPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearpostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
