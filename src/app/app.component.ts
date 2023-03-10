import { Component, ViewChild } from '@angular/core';
import { CourtComponent } from './court/court.component';
import { WhiteboardService } from './whiteboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('court') court: CourtComponent;
  title = 'shuffleboard-whiteboard';

  constructor(private wService: WhiteboardService) {}

}
