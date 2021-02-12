import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArqueosComponent } from './arqueos.component';

describe('ArqueosComponent', () => {
  let component: ArqueosComponent;
  let fixture: ComponentFixture<ArqueosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArqueosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArqueosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
