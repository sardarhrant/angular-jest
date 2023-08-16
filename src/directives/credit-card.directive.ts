import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[credit-card]',
})
export class CreditCardDirective {
  constructor() {}

  @HostBinding('style.border') border!: string;

  @HostListener('input', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const inputEl = event.target as HTMLInputElement;
    const trimmedValue = inputEl.value.replace(/\s+/g, '');

    this.border = '';
    if (/[^\d]+/.test(trimmedValue)) {
      this.border = '2px solid red';
    }

    const numbers = [];
    for (let i = 0; i < trimmedValue.length; i += 4) {
      if (i > 15) break;
      numbers.push(trimmedValue.substr(i, 4));
    }

    inputEl.value = numbers.join(' ');
  }
}
