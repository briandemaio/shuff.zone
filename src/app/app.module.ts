import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CourtComponent } from './court/court.component';
import { DiscsComponent } from './discs/discs.component';

@NgModule({
  declarations: [
    AppComponent,
    CourtComponent,
    DiscsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
