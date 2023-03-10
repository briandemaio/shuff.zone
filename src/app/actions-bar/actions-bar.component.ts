import { Component, OnInit } from '@angular/core';
import { WhiteboardService } from '../whiteboard.service';

@Component({
  selector: 'shuff-actions-bar',
  templateUrl: './actions-bar.component.html',
  styleUrls: ['./actions-bar.component.scss']
})
export class ActionsBarComponent implements OnInit {

  constructor(public wService: WhiteboardService) { }

  ngOnInit(): void {
  }

  toggleBlockBlack() {
    this.wService.toggleSelectedBlockBlack();
  }

  toggleBlockYellow() {
    this.wService.toggleSelectedBlockYellow();
  }

  removeDisc() {
    this.wService.removeSelectedDisc();
  }

}
