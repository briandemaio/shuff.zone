import { Component, OnInit } from '@angular/core';
import { WhiteboardService } from '../whiteboard.service';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';

@Component({
    selector: 'shuff-actions-bar',
    templateUrl: './actions-bar.component.html',
    styleUrls: ['./actions-bar.component.scss'],
    standalone: true,
    imports: [MatIconButton, MatTooltip, MatIcon, NgIf, MatButtonToggleGroup, MatButtonToggle]
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
