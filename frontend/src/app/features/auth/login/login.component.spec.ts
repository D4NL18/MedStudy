import { MockBuilder, MockRender, MockInstance } from 'ng-mocks';
import { LoginComponent } from './login.component';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

describe('LoginComponent', () => {
  MockInstance.scope();

  beforeEach(() => {
    return MockBuilder(LoginComponent)
      .provide(provideMockStore({
        initialState: { auth: { loading: false } }
      }));
  });

  it('should create', () => {
    const fixture = MockRender(LoginComponent, null, { reset: true });
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should dispatch login action on submit if valid', () => {
    const fixture = MockRender(LoginComponent, null, { reset: true });
    const store = fixture.point.injector.get(Store);
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    
    fixture.point.componentInstance.loginForm.patchValue({
      email: 'test@test.com',
      senha: 'password'
    });
    
    fixture.point.componentInstance.onSubmit();
    
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should not dispatch login action if invalid', () => {
    const fixture = MockRender(LoginComponent, null, { reset: true });
    const store = fixture.point.injector.get(Store);
    const dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    
    fixture.point.componentInstance.loginForm.patchValue({
      email: '',
      senha: ''
    });
    
    fixture.point.componentInstance.onSubmit();
    
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
