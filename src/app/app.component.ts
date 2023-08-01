import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'AngularJestSetUp';

  compileAndroidCode() {
    throw new Error('you are using old Angular');
  }
}
