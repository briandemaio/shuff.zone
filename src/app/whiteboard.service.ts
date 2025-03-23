import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Disc } from './disc';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class WhiteboardService {

  private discData: Disc[] = [];
  private lastSelectedDisc: Disc | undefined;

  private index = 0;

  private zoom: 'FOOT' | 'COURT' = 'FOOT';

  private discsUpdatedSource = new Subject<Disc[]>();
  private zoomUpdatedSource = new Subject<'FOOT' | 'COURT'>();

  // Observable string streams
  discsUpdated$ = this.discsUpdatedSource.asObservable();
  zoomUpdated$ = this.zoomUpdatedSource.asObservable();

  private _snackBar = inject(MatSnackBar);

  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => { this.loadDiscsFromQueryParams(params); });
  }

  private discCount(color?: 'YELLOW' | 'BLACK'): number {
    if (!color) {
      return this.discData.length;
    }
    return this.discData.filter(d => d.color === color).length;
  }

  addDisc(color: 'YELLOW' | 'BLACK', blockBlack = false, blockYellow = false, position?: [number, number]) {

    const count = this.discCount(color);
    if (count >= 4) {
      return;
    }
    if (!position) {
      let xPos = color === 'YELLOW' ? 3.5 : .5;
      xPos = xPos + (count * 0.6);
      position = [xPos, 0.5];
    }

    this.discData.push({
      color: color,
      blockBlack: blockBlack,
      blockYellow: blockYellow,
      position: position,
      index: this.index++
    });

    this.discsUpdatedSource.next(this.discs);
  }

  get zoomState(): 'FOOT' | 'COURT' {
    return this.zoom;
  }

  toggleZoom() {
    if (this.zoom === 'FOOT') {
      this.zoom = 'COURT';
    } else {
      this.zoom = 'FOOT';
    }
    this.zoomUpdatedSource.next(this.zoom);
  }

  removeAllDiscs() {
    this.discData = [];
    this.lastSelectedDisc = undefined;
    this.discsUpdatedSource.next(this.discs);
  }

  get discs(): Disc[] {
    return this.discData;
  }

  selectDisc(disc: Disc) {
    this.lastSelectedDisc = disc;
    this.discsUpdatedSource.next(this.discs);
  }

  toggleSelectedBlockBlack() {
    if (this.lastSelectedDisc) {
      this.lastSelectedDisc.blockBlack = !this.lastSelectedDisc?.blockBlack;
    }
    this.discsUpdatedSource.next(this.discs);
  }

  toggleSelectedBlockYellow() {
    if (this.lastSelectedDisc) {
      this.lastSelectedDisc.blockYellow = !this.lastSelectedDisc?.blockYellow;
    }
    this.discsUpdatedSource.next(this.discs);
  }

  removeSelectedDisc() {
    if (this.lastSelectedDisc) {
      const index = this.discData.indexOf(this.lastSelectedDisc);
      if (index >= 0) {
        this.discData.splice(index, 1);
      }
    }
    this.lastSelectedDisc = undefined;
    this.discsUpdatedSource.next(this.discs);
  }

  get selectedDisc(): Disc | undefined {
    return this.lastSelectedDisc;
  }

  shareBoard() {
    this.router.navigate([], { relativeTo: this.route, queryParams: this.getDiscsAsQueryParams() }).then(() => {
      // copy URL to users clipboard and show snackbar message
      navigator.clipboard.writeText(window.location.href).then(() => {
        this._snackBar.open('Board shared! URL copied to clipboard.', 'Dismiss', {
          duration: 3000
        })
      });
    });
  }

  getDiscsAsQueryParams(): Params {
    const discParams: any = {};
    for (const disc of this.discData) {
      const discKey = (disc.color === 'YELLOW' ? 'y' : 'b') + disc.index;
      const minimalDiscInfo = {
        pX: disc.position[0],
        pY: disc.position[1]
      }
      // discParams[discKey] = btoa(JSON.stringify(minimalDiscInfo));
      discParams[discKey] = encodeURIComponent(JSON.stringify(minimalDiscInfo));
    }
    return discParams;
  }

  loadDiscsFromQueryParams(params: Params) {
    this.removeAllDiscs();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        // const discInfo = JSON.parse(atob(params[key]));
        const discInfo = JSON.parse(decodeURIComponent(params[key]));
        const color = key.startsWith('y') ? 'YELLOW' : 'BLACK';
        const index = parseInt(key.substring(1), 10);
        this.addDisc(color, false, false, [discInfo.pX, discInfo.pY]);
      }
    }
  }
}
