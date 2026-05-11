import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockRender, ngMocks, MockInstance } from 'ng-mocks';
import { FlashcardFormComponent } from './flashcard-form.component';
import { FlashcardService } from '../../../../core/services/flashcard.service';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { of } from 'rxjs';
import { ImagePasteDirective } from '../../../../shared/directives/image-paste.directive';

describe('FlashcardFormComponent', () => {
  MockInstance.scope();

  beforeEach(() => {
    return MockBuilder(FlashcardFormComponent)
      .mock(LucideAngularModule)
      .mock(ImagePasteDirective)
      .mock(FlashcardService)
      .mock(Router);
  });

  it('should create', () => {
    const fixture = MockRender(FlashcardFormComponent, null, { reset: true });
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should navigate to flashcards on cancel', () => {
    const navigateSpy = jasmine.createSpy('navigate');
    MockInstance(Router, 'navigate', navigateSpy);
    
    const fixture = MockRender(FlashcardFormComponent, null, { reset: true });
    fixture.point.componentInstance.cancel();
    expect(navigateSpy).toHaveBeenCalledWith(['/flashcards']);
  });

  it('should convert HTML to Markdown correctly', () => {
    const fixture = MockRender(FlashcardFormComponent, null, { reset: true });
    const component = fixture.point.componentInstance as any;
    
    const html = '<div>Hello</div><br><img src="test.png"><div>World</div>';
    const expected = 'Hello\n\n![image](test.png)\n\nWorld';
    expect(component.htmlToMarkdown(html)).toBe(expected);
  });

  it('should call onImagePasted when an image is pasted', () => {
    const fixture = MockRender(FlashcardFormComponent, null, { reset: true });
    const component = fixture.point.componentInstance;
    
    // Mock editors
    component.frenteEditor = { nativeElement: document.createElement('div') } as any;
    
    spyOn(component, 'onImagePasted').and.callThrough();
    component.onImagePasted('data:image/png;base64,abc', 'frente');
    
    expect(component.frenteEditor.nativeElement.querySelector('img')).toBeTruthy();
  });

  it('should call createFlashcard on save', () => {
    const createSpy = jasmine.createSpy('createFlashcard').and.returnValue(of({} as any));
    MockInstance(FlashcardService, 'createFlashcard', createSpy);
    
    const fixture = MockRender(FlashcardFormComponent, null, { reset: true });
    
    // Mock the ViewChild native elements to avoid null pointer
    fixture.point.componentInstance.frenteEditor = { nativeElement: { innerHTML: 'frente' } } as any;
    fixture.point.componentInstance.versoEditor = { nativeElement: { innerHTML: 'verso' } } as any;
    
    fixture.point.componentInstance.save();
    expect(createSpy).toHaveBeenCalled();
  });
});
