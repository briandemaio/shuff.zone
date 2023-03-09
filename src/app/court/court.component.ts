import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Selection, zoom, ZoomBehavior } from 'd3';

@Component({
  selector: 'app-court',
  templateUrl: './court.component.html',
  styleUrls: ['./court.component.scss']
})
export class CourtComponent implements OnInit {

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

  private scaleFactor = 50;

  private svg: Selection<any, any, any, any>;
  private discLayer: Selection<SVGGElement, any, any, any>;
  private blockLayer: Selection<SVGGElement, any, any, any>;
  private courtLayer: Selection<SVGGElement, any, any, any>;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 800 - (this.margin * 2);

  private zoom;

  private discs: any[] = [];
  constructor() { }

  ngOnInit(): void {
    this.zoom = d3.zoom()
      .on('zoom', this.handleZoom.bind(this));
    this.createSvg();
    // this.drawBars(this.data);
    this.drawCourt();
  }

  addDisc(yellow = true) {
    const radius = (3 / 12) * this.scaleFactor;
    const disc = this.discLayer.append('circle')
      .attr('cx', '40px')
      .attr('cy', '40px')
      // 6 inch disc
      .attr('r', radius)
      .style('fill', yellow ? 'yellow' : 'black')
      .style('cursor', 'pointer')
      // .style('stroke-width', radius)
      // .style('stroke', '#FFBA01')
      .call(d3.drag<SVGCircleElement, unknown>()
        .on('drag', this.dragged)
        .on('start', this.dragStarted)
        .on('end', this.dragEnded));

    disc.on('dblclick', this.discDoubleClicked.bind(this, disc))


    this.discs.push(disc);
  }

  dragged(event: any, d: any) {

    d3.select(<any>this).attr("cx", event.x).attr("cy", event.y);
  }
  dragStarted(_event, _d) {
    d3.select(<any>this).raise().attr("stroke", 'black');
  }

  dragEnded(_event, _d) {
    d3.select(<any>this).attr("stroke", null);
  }

  discDoubleClicked(_disc, _event, _d) {
    this.drawBlocking(_disc);
  }

  drawBlocking(targetDisc, fromYellow = true) {
    // TODO: add line thickness?
    // draw from bottom edge, 3 inches from foot, 6 inches from gutter
    // then draw from upper middle edge. 3 inches from 7, 6y inches from center
    // court is 39 feet long and 6 feet wide
    const discX = +targetDisc.attr('cx');
    const discY = +targetDisc.attr('cy');
    const discR = +targetDisc.attr('r');

    const bottomYellowEdge: [number, number] = [(6 - 6 / 12) * this.scaleFactor, (39 - (3 / 12)) * this.scaleFactor];
    // const extendedBottomLine = 
    const topYellowEdge: [number, number] = [(3 + 6 / 12) * this.scaleFactor, (39 - (15 / 12)) * this.scaleFactor];

    // m = (y2-y1)/(x2-x1)
    const mA = (discY - bottomYellowEdge[1]) / ((+discX + discR) - bottomYellowEdge[0]);
    // y = mx + c     -----      c = y - mx
    const cA = bottomYellowEdge[1] - (mA * bottomYellowEdge[0]);
    // x = (y - c) / m
    const newXA = (0 - cA) / mA;

    // do the same for the other line
    // m = (y2-y1)/(x2-x1)
    const mB = (discY - topYellowEdge[1]) / ((+discX - discR) - topYellowEdge[0]);
    // y = mx + c     -----      c = y - mx
    const cB = topYellowEdge[1] - (mB * topYellowEdge[0]);
    // x = (y - c) / m
    const newXB = (0 - cB) / mB;

    // if lines intersect before y=0, then stop them there
    const intersectX = (cB - cA) / (mA - mB);
    const intersectY = mA * intersectX + cA;
    let linesIntersect = intersectY > 0;

    const lineAEndPoint: [number, number] = linesIntersect ? [intersectX, intersectY] : [newXA, 0];
    const lineBEndPoint: [number, number] = linesIntersect ? [intersectX, intersectY] : [newXB, 0];

    const lineData: [number, number][] = [bottomYellowEdge, lineAEndPoint];
    const line = d3.line();
    this.blockLayer.append('path')
      .style("stroke", "lightgreen")
      .style("stroke-width", 3)
      .attr('d', line(lineData))

    const otherLineData: [number, number][] = [topYellowEdge, lineBEndPoint];
    // const otherLine = d3.line();
    this.blockLayer.append('path')
      .style("stroke", "lightgreen")
      .style("stroke-width", 3)
      .attr('d', line(otherLineData))
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
    this.blockLayer = this.svg.append('g');
    this.discLayer = this.svg.append('g');
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
    this.drawCourtShape(this.courtLayer, this.tenOff, this.scaleFactor);
    this.drawCourtShape(this.courtLayer, this.leftSeven, this.scaleFactor);
    this.drawCourtShape(this.courtLayer, this.rightSeven, this.scaleFactor);
    this.drawCourtShape(this.courtLayer, this.leftEight, this.scaleFactor);
    this.drawCourtShape(this.courtLayer, this.rightEight, this.scaleFactor);
    this.drawCourtShape(this.courtLayer, this.ten, this.scaleFactor);

    const deadLine = d3.line();
    const scaledLineWidth = (1 / 12) * (3 / 4) * this.scaleFactor;
    const scaledDeadLine = this.scaleLineData(this.deadLine, this.scaleFactor);
    this.courtLayer.append('path')
      .style("stroke", "black")
      .style("stroke-width", `${scaledLineWidth}px`)
      .attr('d', deadLine(scaledDeadLine))

    // tips of 10s are 18 feet apart
    const head = this.courtLayer.clone(true).attr('transform', `rotate(180,${3 * this.scaleFactor},${10.5 * this.scaleFactor})translate(0,-${18 * this.scaleFactor})`) // translate(0,-2000)

  }

  private scaleLineData(lineData: [number, number][], scaleFactor: number): [number, number][] {
    const newLineData: [number, number][] = [];

    for (const point of lineData) {
      newLineData.push([point[0] * scaleFactor, point[1] * scaleFactor]);
    }

    return newLineData;
  }

  private drawCourtShape(layer: Selection<SVGGElement, any, any, any>, points: { x: number, y: number }[], scaleFactor: number) {
    // https://bl.ocks.org/HarryStevens/a1287efa722f7e681dd0b8e8c9e616c9
    // const newPoints = geometric.polygonScale(points, scaleFactor);
    // lines are 3/4ths of an inch thick
    const scaledLineWidth = (1 / 12) * (3 / 4) * scaleFactor;
    layer.append('polygon')
      .attr('points', this.pointsToString(points, scaleFactor))
      .style('fill', 'teal')
      .style('stroke', 'black')
      .style('stroke-width', `${scaledLineWidth}px`);
  }

  private pointsToString(points: { x: number, y: number }[], scaleFactor?: number) {
    return points.map((point) => '' + point.x * (scaleFactor ? scaleFactor : 1) + ',' + point.y * (scaleFactor ? scaleFactor : 1)).join(' ');
  }
  // https://github.com/alisani081/whiteboard/blob/master/static/js/index.js
  // https://bost.ocks.org/mike/chart/
  // d3 scale (set up scale => x(original), y(original))
}

//https://math.stackexchange.com/questions/543496/how-to-find-the-equation-of-a-line-tangent-to-a-circle-that-passes-through-a-g