import { ImagePasteDirective } from './image-paste.directive';

describe('ImagePasteDirective', () => {
  let directive: ImagePasteDirective;

  beforeEach(() => {
    directive = new ImagePasteDirective();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should not emit if no items in clipboard', () => {
    const spy = spyOn(directive.imagePasted, 'emit');
    directive.onPaste({ clipboardData: { items: [] } } as any);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit if image is in clipboard', (done) => {
    const mockFile = new File([''], 'test.png', { type: 'image/png' });
    const mockItem = {
      type: 'image/png',
      getAsFile: () => mockFile
    };
    
    directive.imagePasted.subscribe(base64 => {
      expect(base64).toContain('data:image/png;base64');
      done();
    });

    directive.onPaste({ 
      clipboardData: { 
        items: [mockItem] 
      },
      preventDefault: () => {},
      stopPropagation: () => {}
    } as any);
  });
});
