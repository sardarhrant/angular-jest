import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'AngularJestSetUp';

  sum(a: number, b: number): number {
    return a + b;
  }

  compileAndroidCode() {
    throw new Error('you are using old Angular');
  }
}
