import { Component, OnInit } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { WhiteboardService } from '../whiteboard.service';

import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
    selector: 'shuff-actions-bar',
    templateUrl: './actions-bar.component.html',
    styleUrls: ['./actions-bar.component.scss'],
    imports: [MatButtonToggleModule, MatButtonModule, MatIconModule, MatTooltipModule]
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

  shareBoard() {
    this.wService.shareBoard();
  }

}
