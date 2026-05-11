import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appImagePaste]',
  standalone: true
})
export class ImagePasteDirective {
  @Output() imagePasted = new EventEmitter<string>();

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          this.convertToBase64(file);
          event.preventDefault();
        }
      }
    }
  }

  private convertToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64 = e.target.result;
      this.imagePasted.emit(base64);
    };
    reader.readAsDataURL(file);
  }
}
