import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Selection, zoom, ZoomBehavior } from 'd3';
import { Disc } from '../disc';
import { WhiteboardService } from '../whiteboard.service';

@Component({
  selector: 'shuff-court',
  templateUrl: './court.component.html',
  styleUrls: ['./court.component.scss']
})
export class CourtComponent implements OnInit {

  // TODO: register TLD? shuff.cool or shuff.zone?

  private tenOff: { x: number, y: number }[] = [
    { x: 0, y: 0 },
    { x: 6, y: 0 },
    { x: 5.5, y: 1.5 },
    { x: .5, y: 1.5 },
  ];

  private leftSeven = [
    { x: 0, y: 1.5 },
    { x: 3, y: 1.5 },
    { x: 3, y: 4.5 },
    { x: 1, y: 4.5 },
  ];

  private rightSeven = [
    { x: 3, y: 1.5 },
    { x: 6, y: 1.5 },
    { x: 5, y: 4.5 },
    { x: 3, y: 4.5 },
  ];

  private leftEight = [
    { x: 1, y: 4.5 },
    { x: 3, y: 4.5 },
    { x: 3, y: 7.5 },
    { x: 2, y: 7.5 },
  ];

  private rightEight = [
    { x: 3, y: 4.5 },
    { x: 5, y: 4.5 },
    { x: 4, y: 7.5 },
    { x: 3, y: 7.5 },
  ];

  private ten = [
    { x: 2, y: 7.5 },
    { x: 4, y: 7.5 },
    { x: 3, y: 10.5 }
  ];

  private deadLine: [number, number][] = [[0, 13.5], [6, 13.5]];

  private svg: Selection<any, any, any, any>;
  private discLayer: Selection<SVGGElement, Disc, any, any>;
  private blockLayer: Selection<SVGGElement, any, any, any>;
  private courtLayer: Selection<SVGGElement, any, any, any>;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 800 - (this.margin * 2);

  private zoom;

  private outsideBlackEdge: [number, number] = [(6 / 12), (39 - (3 / 12))];
  private insideBlackEdge: [number, number] = [(3 - 6 / 12), (39 - (15 / 12))];

  private outsideYellowEdge: [number, number] = [(6 - 6 / 12), (39 - (3 / 12))];
  private insideYellowEdge: [number, number] = [(3 + 6 / 12), (39 - (15 / 12))];

  private blockingLineData: [number, number][][] = [];
  private line = d3.line();
  constructor(private wService: WhiteboardService) { }

  ngOnInit(): void {
    this.wService.discsUpdated$.subscribe(() => {this.updateDiscs(); this.calcAndDrawBlocking();});
    this.zoom = d3.zoom()
      .on('zoom', this.handleZoom.bind(this));
    this.createSvg();
    // this.drawBars(this.data);
    this.drawCourt();
    this.updateDiscs();
  }

  dragged(event: any, d: Disc) {

    d3.select(<any>this).attr("cx", d.position[0] = event.x).attr("cy", d.position[1] = event.y);
  }
  dragStarted(event: MouseEvent, d: Disc) {
    // this is event.sourceEvent.target
    // d3.select(event.target)
    d3.select(<any>this).raise().attr("stroke", 'black');
    this.wService.selectDisc(d);
  }

  dragEnded(_event, _d) {
    d3.select(<any>this).attr("stroke", null);
  }

  discClicked(_event, d: Disc) {
    this.wService.selectDisc(d);
  }

  calcAndDrawBlocking() {
    this.blockingLineData = [];
    for (const disc of this.wService.discs) {
      if (disc.blockBlack || disc.blockYellow) {
        this.calculateBlocking(disc);
      }
    }    
    this.drawBlocking();
  }

  calculateBlocking(disc: Disc) {
    if (!disc.blockBlack && !disc.blockYellow) {
      return;
    }
    // TODO: add line thickness?
    // draw from bottom edge, 3 inches from foot, 6 inches from gutter
    // then draw from upper middle edge. 3 inches from 7, 6y inches from center
    // court is 39 feet long and 6 feet wide
    const discX = disc.position[0];
    const discY = disc.position[1];
    const discR = 3/12;

    const leftDiscEdge: [number, number] = [discX - discR, discY];
    const rightDiscEdge: [number, number] = [discX + discR, discY];


    if (disc.blockBlack) {
      this.blockingLineData.push(...this.getBlockingLineData(this.outsideBlackEdge, leftDiscEdge, this.insideBlackEdge, rightDiscEdge));
    }

    if (disc.blockYellow) {
      this.blockingLineData.push(...this.getBlockingLineData(this.insideYellowEdge, leftDiscEdge, this.outsideYellowEdge, rightDiscEdge));
    }
  }

  getBlockingLineData(
    leftDiscPoint: [number, number],
    leftStartPoint: [number, number],
    rightDiscPoint: [number, number],
    rightStartPoint: [number, number]): [number, number][][] {
    // m = (y2-y1)/(x2-x1)
    const mA = (leftDiscPoint[1] - leftStartPoint[1]) / (leftDiscPoint[0] - leftStartPoint[0]);
    // y = mx + c     -----      c = y - mx
    const cA = leftStartPoint[1] - (mA * leftStartPoint[0]);
    // x = (y - c) / m
    const newXA = (0 - cA) / mA;


    // do the same for the other line
    // m = (y2-y1)/(x2-x1)
    const mB = (rightDiscPoint[1] - rightStartPoint[1]) / (rightDiscPoint[0] - rightStartPoint[0]);
    // y = mx + c     -----      c = y - mx
    const cB = rightStartPoint[1] - (mB * rightStartPoint[0]);
    // x = (y - c) / m
    const newXB = (0 - cB) / mB;

    // if lines intersect before y=0, then stop them there
    const intersectX = (cB - cA) / (mA - mB);
    const intersectY = mA * intersectX + cA;
    let linesIntersect = intersectY > 0;

    const lineAEndPoint: [number, number] = linesIntersect ? [intersectX, intersectY] : [newXA, 0];
    const lineBEndPoint: [number, number] = linesIntersect ? [intersectX, intersectY] : [newXB, 0];

    const lineData: [number, number][] = [leftDiscPoint, lineAEndPoint];
    const otherLineData: [number, number][] = [rightDiscPoint, lineBEndPoint];

    return [lineData, otherLineData];

  }

  drawBlocking() {
    this.blockLayer.selectAll('*').remove();
    for (const line of this.blockingLineData) {
      this.blockLayer.append('path')
        .style("stroke", "lightgreen")
        .style("stroke-width", 1/12)
        .attr('d', this.line(line))
    }
  }

  private createSvg(): void {
    this.svg = d3.select("figure#court")
      .append("svg")
      .call(this.zoom)
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")")
      ;

    this.courtLayer = this.svg.append('g');
    this.blockLayer = this.svg.append('g').attr('id', 'blocks');
    this.discLayer = this.svg.append('g').attr('id', 'discs');
    // d3.select('figure#court').call(zoom);
  }

  private handleZoom(e: any) {
    this.svg
      .attr('transform', e.transform);
  }

  private drawCourt() {
    // this.courtLayer.append('rect')
    //   .attr("width", "100%")
    //   .attr("height", "100%")
    //   .attr('fill', 'teal');
    this.drawCourtShape(this.courtLayer, this.tenOff);
    this.drawCourtShape(this.courtLayer, this.leftSeven);
    this.drawCourtShape(this.courtLayer, this.rightSeven);
    this.drawCourtShape(this.courtLayer, this.leftEight);
    this.drawCourtShape(this.courtLayer, this.rightEight);
    this.drawCourtShape(this.courtLayer, this.ten);

    const deadLine = d3.line();
    const scaledLineWidth = (1 / 12) * (3 / 4);
    const scaledDeadLine = this.scaleLineData(this.deadLine);
    this.courtLayer.append('path')
      .style("stroke", "black")
      .style("stroke-width", `${scaledLineWidth}px`)
      .attr('d', deadLine(scaledDeadLine))

    // tips of 10s are 18 feet apart
    const head = this.courtLayer.clone(true).attr('transform', `rotate(180,${3},${10.5})translate(0,-${18})`) // translate(0,-2000)

  }

  private updateDiscs() {
    const radius = (3 / 12);
    const disc = this.discLayer
    const discs = d3.select('#discs')
      .selectAll('circle')
      .data(this.wService.discs, (d: any) => d.index)
      .join(
        enter => enter
          .append('circle')
          .attr('cx', d => `${d.position[0]}px`)
          .attr('cy', d => `${d.position[1]}px`)
          // 6 inch disc
          .attr('r', 0.5 / 2)
          .style('fill', d => d.color.toLowerCase())
          .style('cursor', 'pointer')
          // .style('stroke-width', radius)
          // .style('stroke', '#FFBA01')
          .call(d3.drag<SVGCircleElement, Disc>()
            .on('drag', this.dragged)
            .on('start', (e, d) => this.dragStarted)
            .on('end', this.dragEnded))
          .on('click', this.discClicked.bind(this)),
        update => update,
        exit => exit.remove()
      );
  }

  private scaleLineData(lineData: [number, number][]): [number, number][] {
    const newLineData: [number, number][] = [];

    for (const point of lineData) {
      newLineData.push([point[0], point[1]]);
    }

    return newLineData;
  }

  private drawCourtShape(layer: Selection<SVGGElement, any, any, any>, points: { x: number, y: number }[]) {
    // https://bl.ocks.org/HarryStevens/a1287efa722f7e681dd0b8e8c9e616c9
    // const newPoints = geometric.polygonScale(points, scaleFactor);
    // lines are 3/4ths of an inch thick
    const scaledLineWidth = (1 / 12) * (3 / 4);
    layer.append('polygon')
      .attr('points', this.pointsToString(points))
      .style('fill', 'teal')
      .style('stroke', 'black')
      .style('stroke-width', `${scaledLineWidth}px`);
  }

  private pointsToString(points: { x: number, y: number }[]) {
    return points.map((point) => '' + point.x + ',' + point.y).join(' ');
  }
  // https://github.com/alisani081/whiteboard/blob/master/static/js/index.js
  // https://bost.ocks.org/mike/chart/
  // d3 scale (set up scale => x(original), y(original))
}

//https://math.stackexchange.com/questions/543496/how-to-find-the-equation-of-a-line-tangent-to-a-circle-that-passes-through-a-g