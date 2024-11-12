import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarPublicacionPage } from './modificar-publicacion.page';

describe('ModificarPublicacionPage', () => {
  let component: ModificarPublicacionPage;
  let fixture: ComponentFixture<ModificarPublicacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarPublicacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
