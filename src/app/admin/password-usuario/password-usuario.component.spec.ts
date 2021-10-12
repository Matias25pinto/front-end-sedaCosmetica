import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordUsuarioComponent } from './password-usuario.component';

describe('PasswordUsuarioComponent', () => {
  let component: PasswordUsuarioComponent;
  let fixture: ComponentFixture<PasswordUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
