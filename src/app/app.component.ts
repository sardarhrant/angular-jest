import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'AngularJestSetUp';

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
}
