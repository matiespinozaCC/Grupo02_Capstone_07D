import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AyudaSoportePage } from './ayuda-soporte.page';

describe('AyudaSoportePage', () => {
  let component: AyudaSoportePage;
  let fixture: ComponentFixture<AyudaSoportePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AyudaSoportePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
