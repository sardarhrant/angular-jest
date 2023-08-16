import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[highlight-term]',
})
export class HighlighttermDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @Input('highlight-term') searchTerm: string = '';

  ngOnChanges() {
    this.highlight();
  }

  private highlight() {
    if (this.searchTerm && this.searchTerm.length > 0) {
      const text = this.el.nativeElement.textContent;
      const index = text.toLowerCase().indexOf(this.searchTerm.toLowerCase());

      if (index !== -1) {
        const before = text.substring(0, index);
        const middle = text.substring(index, index + this.searchTerm.length);
        const after = text.substring(index + this.searchTerm.length);

        const highlighted = `${before}<mark>${middle}</mark>${after}`;

        this.renderer.setProperty(
          this.el.nativeElement,
          'innerHTML',
          highlighted
        );
      } else {
        this.renderer.setProperty(this.el.nativeElement, 'innerHTML', text);
      }
    }
  }
}
