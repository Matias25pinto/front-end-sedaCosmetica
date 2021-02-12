import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoPdfComponent } from './catalogo-pdf.component';

describe('CatalogoPdfComponent', () => {
  let component: CatalogoPdfComponent;
  let fixture: ComponentFixture<CatalogoPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
