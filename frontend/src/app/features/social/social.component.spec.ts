import { MockBuilder, MockRender } from 'ng-mocks';
import { SocialComponent } from './social.component';
import { SocialService } from '../../core/services/social.service';
import { ToastService } from '../../core/services/toast.service';
import { ProfileService } from '../../core/services/profile.service';
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

  it('should view detailed profile and load it from service', () => {
    const fixture = MockRender(SocialComponent);
    const comp = fixture.point.componentInstance;
    const profileService = fixture.point.injector.get(ProfileService);
    
    const mockProfile = {
      id: '123',
      nomeCompleto: 'Dr. John Doe',
      handle: 'john.doe',
      avatarPresetId: 'pediatria',
      isPublic: false,
      isPrivate: true,
      streak: 0,
      totalQuestions: 0
    };
    
    spyOn(profileService, 'getPublicProfile').and.returnValue(of(mockProfile as any));

    comp.viewDetailedProfile({ handle: 'john.doe' });
    
    expect(profileService.getPublicProfile).toHaveBeenCalledWith('john.doe');
    expect(comp.selectedProfileDetail()).toEqual(mockProfile as any);
  });
});
