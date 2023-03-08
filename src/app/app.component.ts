import { Component, ViewChild } from '@angular/core';
import { CourtComponent } from './court/court.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('court') court: CourtComponent;
  title = 'shuffleboard-whiteboard';

  addYellow() {
    this.court.addDisc(true);
  }

  addBlack() {
    this.court.addDisc(false);
  }
}
