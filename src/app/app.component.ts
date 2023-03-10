import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CourtComponent } from './court/court.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('court') court: CourtComponent;
  title = 'shuffleboard-whiteboard';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {}

    ngOnInit() {
      this.addCustomIcons();
    }

    addCustomIcons() {
      this.matIconRegistry.addSvgIcon(
        `block_disc`,
        this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/block.svg')
      );
      this.matIconRegistry.addSvgIcon(
        `unblock_disc`,
        this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/unblock.svg')
      );
    }
}
