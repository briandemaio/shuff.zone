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

  toggleZoom() {
    this.wService.toggleZoom();
  }

  toggleBlockLeft() {
    this.wService.toggleSelectedBlockBlack();
  }

  toggleBlockRight() {
    this.wService.toggleSelectedBlockYellow();
  }

  removeDisc() {
    this.wService.removeSelectedDisc();
  }

  removeAll() {
    this.wService.removeAllDiscs();
  }

  addYellow() {
    this.wService.addDisc('YELLOW');
  }

  addBlack() {
    this.wService.addDisc('BLACK');
  }

}
