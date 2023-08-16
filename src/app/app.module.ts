import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CreditCardDirective } from 'src/directives/credit-card.directive';
import { CardComponent } from './components/card/card.component';
import { UsersComponent } from './components/users/users.component';
import { HighlighttermDirective } from 'src/directives/highlightterm.directive';
import { HighlighterDirective } from 'src/directives/highlighter.directive';

@NgModule({
  declarations: [
    AppComponent,
    CreditCardDirective,
    HighlighterDirective,
    CardComponent,
    UsersComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
