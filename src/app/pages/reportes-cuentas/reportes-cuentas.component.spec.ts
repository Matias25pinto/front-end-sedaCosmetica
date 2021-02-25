import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesCuentasComponent } from './reportes-cuentas.component';

describe('ReportesCuentasComponent', () => {
  let component: ReportesCuentasComponent;
  let fixture: ComponentFixture<ReportesCuentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesCuentasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
