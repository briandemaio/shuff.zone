import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CourtComponent } from './court/court.component';
import { ActionsBarComponent } from './actions-bar/actions-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    CourtComponent,
    ActionsBarComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
