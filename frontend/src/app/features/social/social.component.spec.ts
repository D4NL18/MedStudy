import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockRender } from 'ng-mocks';
import { SocialComponent } from './social.component';
import { SocialService } from '../../core/services/social.service';
import { ToastService } from '../../core/services/toast.service';
import { of } from 'rxjs';

describe('SocialComponent', () => {
  beforeEach(() => {
    return MockBuilder(SocialComponent)
      .mock(SocialService, {
        getFriends: () => of([]),
        getPendingRequests: () => of([]),
        getBlockedUsers: () => of([]),
        getSocialNotifications: () => of([])
      })
      .mock(ToastService);
  });

  it('should create', () => {
    const fixture = MockRender(SocialComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should start with activeTab = friends', () => {
    const fixture = MockRender(SocialComponent);
    const comp = fixture.point.componentInstance;
    expect(comp.activeTab()).toBe('friends');
  });

  it('should change active tab and load appropriate data', () => {
    const fixture = MockRender(SocialComponent);
    const comp = fixture.point.componentInstance;
    const socialService = fixture.point.injector.get(SocialService);
    
    spyOn(socialService, 'getFriends').and.callThrough();
    spyOn(socialService, 'getPendingRequests').and.callThrough();
    spyOn(socialService, 'getBlockedUsers').and.callThrough();
    spyOn(socialService, 'getSocialNotifications').and.callThrough();

    comp.changeTab('pending');
    expect(comp.activeTab()).toBe('pending');
    expect(socialService.getPendingRequests).toHaveBeenCalled();

    comp.changeTab('blocked');
    expect(comp.activeTab()).toBe('blocked');
    expect(socialService.getBlockedUsers).toHaveBeenCalled();

    comp.changeTab('notifications');
    expect(comp.activeTab()).toBe('notifications');
    expect(socialService.getSocialNotifications).toHaveBeenCalled();
  });
});
