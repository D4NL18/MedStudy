import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockRender, MockInstance } from 'ng-mocks';
import { FlashcardFormComponent } from './flashcard-form.component';
import { FlashcardService } from '@core/services/flashcard.service';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { of } from 'rxjs';
import { ImagePasteDirective } from '@shared/directives/image-paste.directive';
import { ImageCompressorService } from '@core/services/image-compressor.service';

describe('FlashcardFormComponent', () => {
  MockInstance.scope();

  beforeEach(() => {
    return MockBuilder(FlashcardFormComponent)
      .mock(LucideAngularModule)
      .mock(ImagePasteDirective)
      .mock(FlashcardService)
      .mock(ImageCompressorService)
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

  it('should call onImagePasted when an image is pasted', async () => {
    const fixture = MockRender(FlashcardFormComponent, null, { reset: true });
    const component = fixture.point.componentInstance;
    
    // Mock editors
    component.frenteEditor = { nativeElement: document.createElement('div') } as any;
    
    const compressor = TestBed.inject(ImageCompressorService);
    spyOn(compressor, 'compressImage').and.returnValue(Promise.resolve('data:image/webp;base64,compressed'));
    
    spyOn(component, 'onImagePasted').and.callThrough();
    await component.onImagePasted('data:image/png;base64,abc', 'frente');
    
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

  it('should convert TipTap object to HTML without throwing', () => {
    const fixture = MockRender(FlashcardFormComponent, null, { reset: true });
    const component = fixture.point.componentInstance;

    const tipTapObj = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Quais são as indicações de biópsia renal?' }
          ]
        }
      ]
    };

    const html = component.toEditorHtml(tipTapObj);
    expect(html).toContain('Quais são as indicações de biópsia renal?');
    expect(html).toContain('<div>');
  });

  it('should convert TipTap JSON string to HTML correctly', () => {
    const fixture = MockRender(FlashcardFormComponent, null, { reset: true });
    const component = fixture.point.componentInstance;

    const tipTapJson = JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Síndrome Nefrítica', marks: [{ type: 'bold' }] }
          ]
        }
      ]
    });

    const html = component.toEditorHtml(tipTapJson);
    expect(html).toContain('<strong>Síndrome Nefrítica</strong>');
  });

  it('should handle markdown strings in toEditorHtml', () => {
    const fixture = MockRender(FlashcardFormComponent, null, { reset: true });
    const component = fixture.point.componentInstance;

    const md = 'Linha 1\nLinha 2';
    const html = component.toEditorHtml(md);
    expect(html).toBe('Linha 1<br>Linha 2');
  });

  it('should safely populate editors on ngAfterViewInit when editing TipTap card', () => {
    const fixture = MockRender(FlashcardFormComponent, null, { reset: true });
    const component = fixture.point.componentInstance;

    component.isEdit = true;
    component.data = {
      flashcard: {
        id: '123',
        grandeArea: 'Pediatria',
        frente: {
          type: 'doc',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Pergunta TipTap' }] }]
        },
        verso: {
          type: 'doc',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Resposta TipTap' }] }]
        }
      }
    };

    component.frenteEditor = { nativeElement: document.createElement('div') } as any;
    component.versoEditor = { nativeElement: document.createElement('div') } as any;

    expect(() => component.ngAfterViewInit()).not.toThrow();
    expect(component.frenteEditor.nativeElement.innerHTML).toContain('Pergunta TipTap');
    expect(component.versoEditor.nativeElement.innerHTML).toContain('Resposta TipTap');
  });
});
