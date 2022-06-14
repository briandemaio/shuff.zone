import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as geometric from 'geometric';
import { Selection, zoom } from 'd3';

@Component({
  selector: 'app-court',
  templateUrl: './court.component.html',
  styleUrls: ['./court.component.scss']
})
export class CourtComponent implements OnInit {
  // private data = [
  //   {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
  //   {"Framework": "React", "Stars": "150793", "Released": "2013"},
  //   {"Framework": "Angular", "Stars": "62342", "Released": "2016"},
  //   {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
  //   {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
  // ];
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
  

  private svg: Selection<any, any, any, any>;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 800 - (this.margin * 2);
  constructor() { }

  ngOnInit(): void {
    d3.zoom()
      .on('zoom', this.handleZoom);
    this.createSvg();
    // this.drawBars(this.data);
    this.drawCourt();
  }

  private createSvg(): void {
    this.svg = d3.select("figure#court")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");

    d3.select('figure#court').call(zoom);
  }

  private handleZoom(e: any) {
    d3.select("figure#court")
      .attr('transform', e.transform);
  }

  private drawCourt() {
    this.drawShape(this.tenOff, 25);
    this.drawShape(this.leftSeven, 25);
    this.drawShape(this.rightSeven, 25);
    this.drawShape(this.leftEight, 25);
    this.drawShape(this.rightEight, 25);
    this.drawShape(this.ten, 25);
    // this.svg.append('polygon').attr('points', this.pointsToString(this.tenOff)).style('fill', 'teal').style('stroke', 'black').style('strokeWidth', '2px');
    // this.svg.append('polygon').attr('points', this.pointsToString(this.leftSeven)).style('fill', 'teal').style('stroke', 'black').style('strokeWidth', '2px');
    // this.svg.append('polygon').attr('points', this.pointsToString(this.rightSeven)).style('fill', 'teal').style('stroke', 'black').style('strokeWidth', '2px');
    // this.svg.append('polygon').attr('points', this.pointsToString(this.leftEight)).style('fill', 'teal').style('stroke', 'black').style('strokeWidth', '2px');
    // this.svg.append('polygon').attr('points', this.pointsToString(this.rightEight)).style('fill', 'teal').style('stroke', 'black').style('strokeWidth', '2px');
    // this.svg.append('polygon').attr('points', this.pointsToString(this.ten)).style('fill', 'teal').style('stroke', 'black').style('strokeWidth', '2px');

    
  }

  private drawShape(points: {x: number, y:number}[], scaleFactor: number) {
    // https://bl.ocks.org/HarryStevens/a1287efa722f7e681dd0b8e8c9e616c9
    // const newPoints = geometric.polygonScale(points, scaleFactor);
    this.svg.append('polygon').attr('points', this.pointsToString(points, scaleFactor)).style('fill', 'teal').style('stroke', 'black').style('strokeWidth', '2px');
  }

  private pointsToString(points: { x: number, y: number }[], scaleFactor?: number) {
    return points.map((point) => '' + point.x * (scaleFactor ? scaleFactor : 1) + ',' + point.y * (scaleFactor ? scaleFactor : 1)).join(' ');
  }
}
