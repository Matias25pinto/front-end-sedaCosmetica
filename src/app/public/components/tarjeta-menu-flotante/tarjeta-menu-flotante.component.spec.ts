import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaMenuFlotanteComponent } from './tarjeta-menu-flotante.component';

describe('TarjetaMenuFlotanteComponent', () => {
  let component: TarjetaMenuFlotanteComponent;
  let fixture: ComponentFixture<TarjetaMenuFlotanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarjetaMenuFlotanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaMenuFlotanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
