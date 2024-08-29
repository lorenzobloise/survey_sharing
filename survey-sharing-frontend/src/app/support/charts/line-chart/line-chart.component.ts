import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnChanges {

  @Input() data!: number[];
  @Input() categories!: string[];
  @Input() type!: string;

  chartOptions!: any;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChartOptions();
  }

  updateChartOptions(){
    const color: string = this.getAxisColor();
    this.chartOptions = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: this.categories,
        axisLabel: {
          color: color
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: color
          }
        },
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: color,
          formatter: (value: number) => {
            if(value===Math.floor(value))
              return value.toString();
            else
              return '';
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: color
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: color,
            width: 0.1
          }
        },
        scale: true
      },
      series: [{
        data: this.data,
        type: 'line',
        step: 'end',
        itemStyle: {
          color: this.getChartColor()
        }
      }]
    }
  }

  getAxisColor(): string {
    const theme: string | null = localStorage.getItem('theme');
    if(theme!=null){
      if(theme=='dark')
        return '#ffffff';
      else
        return '#333333';
    }
    return '#333333';
  }

  getChartColor(): string {
    if(this.type=='Answers')
      return '#F44336';
    if(this.type=='Ratings')
      return 'orange';
    return '';
  }

}
