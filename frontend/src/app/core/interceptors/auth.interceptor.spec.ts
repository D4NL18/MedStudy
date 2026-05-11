import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as AuthActions from '../../store/auth/auth.actions';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideMockStore({
          initialState: { auth: { token: 'test-token' } }
        })
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add authorization header', (done) => {
    httpClient.get('/api/test-auth').subscribe(() => {
      done();
    });
    
    const req = httpMock.expectOne('/api/test-auth');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush({});
  });

  it('should dispatch logout on 401', (done) => {
    const dispatchSpy = spyOn(store, 'dispatch');
    httpClient.get('/api/test-401').subscribe({
      error: () => {
        expect(dispatchSpy).toHaveBeenCalled();
        done();
      }
    });
    
    const req = httpMock.expectOne('/api/test-401');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });
});
