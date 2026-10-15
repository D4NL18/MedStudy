import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '@core/services/auth.service';
import { provideMockStore } from '@ngrx/store/testing';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    authServiceSpy.register.and.returnValue(of({} as any));

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        provideMockStore({ initialState: { auth: { user: null, token: null, loading: false, error: null } } }),
        { provide: AuthService, useValue: authServiceSpy },
        importProvidersFrom(LucideAngularModule.pick({ Eye, EyeOff }))
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
