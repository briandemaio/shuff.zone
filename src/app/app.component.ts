import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CourtComponent } from './court/court.component';
import { ActionsBarComponent } from './actions-bar/actions-bar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [CourtComponent, ActionsBarComponent]
})
export class AppComponent implements OnInit {
  @ViewChild('court') court: CourtComponent;
  title = 'shuff-zone';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {}

    ngOnInit() {
      this.addCustomIcons();
    }

    addCustomIcons() {
      this.matIconRegistry.addSvgIcon(
        `block_left`,
        this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/block-left.svg')
      );
      this.matIconRegistry.addSvgIcon(
        `block_right`,
        this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/block-right.svg')
      );
    }
}
