import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActionsBarComponent } from './actions-bar/actions-bar.component';
import { AppComponent } from './app.component';
import { CourtComponent } from './court/court.component';

@NgModule({ declarations: [
        AppComponent,
        CourtComponent,
        ActionsBarComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatIconModule,
        MatTooltipModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
