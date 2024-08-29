import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Statistics } from 'src/app/entities/statistics';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnChanges {

  @Input() data: any[] = [0,0,0,0,0];
  @Input() categories: string[] = [];
  @Input() type: string = "";

  chartOptions: any;

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
        min: 0,
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
        type: 'bar',
        itemStyle: {
          color: this.getChartColor()
        }
      }]
    };
  }

  getChartColor(): string {
    var result: string = "";
    if(this.type=='Ratings')
      result = 'orange';
    if(this.type=='Age')
      result = '#4CAF50';
    if(this.type=='World')
      result = '#F44336';
    if(this.type=='Answers')
      result = '#2196F3';
    return result;
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

}
