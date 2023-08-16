import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EMPTY, debounceTime, fromEvent } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import {
  catchError,
  distinctUntilChanged,
  pluck,
  switchMap,
} from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const BASE_URL = 'https://api.openbrewerydb.org/breweries';

export const breweryTypeahead =
  (ajaxHelper = ajax as any) =>
  (sourceObservable: unknown | any) => {
    return sourceObservable.pipe(
      debounceTime(200),
      pluck('target', 'value'),
      distinctUntilChanged(),
      switchMap((searchTerm) =>
        ajaxHelper
          .getJSON(`${BASE_URL}?by_name=${searchTerm}`)
          .pipe(catchError(() => EMPTY))
      )
    );
  };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'AngularJestSetUp';
  @ViewChild('users') users!: ElementRef;
  @ViewChild('ajaxResponse') ajaxResponse!: ElementRef;

  ngOnInit(): void {
    const arr1 = [5, 9, 22, 25, 6, -1, 8, 10];
    const arr2 = [9, 6, -1, 10];

    console.log(this.getSubSequence(arr1, arr2));
  }

  compileAndroidCode() {
    throw new Error('you are using old Angular');
  }

  getSubSequence(array: Array<Number>, sequence: Array<Number>): boolean {
    let sequenceIdx = 0;
    for (const number of array) {
      if (number === sequence[sequenceIdx]) sequenceIdx++;
      if (sequenceIdx === sequence.length) return true;
    }

    return false;
  }

  getGithubUsers(input: any) {
    // console.log(input.target.value);
    // console.log(this.users.nativeElement.value);
    const input$ = fromEvent(this.users.nativeElement, 'input');

    input$.pipe(breweryTypeahead()).subscribe((response: any) => {
      this.ajaxResponse.nativeElement.innerHTML = response
        .map((el: any) => el.name)
        .join('<br/>');
    });
  }
}
