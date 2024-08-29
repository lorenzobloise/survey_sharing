import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnChanges {

  @Input() data: number[] = [];
  @Input() type: string = "";

  chartOptions: any;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChartOptions();
  }

  updateChartOptions(): void {
    const color = this.getLabelColor();
    const pieChartData = this.getPieChartData();
    const pieChartColor = this.getPieChartColor();
    this.chartOptions = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      grid: {
        left: 10,
        right: 10,
        bottom: 10,
        top: 10,
        containLabel: true
      },
      series: [
        {
          name: this.type,
          type: 'pie',
          radius: '90%',
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          data: pieChartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            show: true,
            color: color,
            formatter: '{b}: {d}%',
          },
          labelLine: {
            show: true
          },
          color: pieChartColor
        }
      ]
    };
  }

  getPieChartData(): {name: string, value: number}[] {
    var result: {name: string, value: number}[] = [];
    if(this.type=='Feedbacks'){
      result.push({name: 'Positive feedbacks', value: this.data[0]});
      result.push({name: 'Negative feedbacks', value: this.data[1]});
      result.push({name: 'Mixed feedbacks', value: this.data[2]});
      result.push({name: 'Neutral feedbacks', value: this.data[3]});
    }
    if(this.type=='Gender'){
      result.push({name: 'Male', value: this.data[0]});
      result.push({name: 'Female', value: this.data[1]});
    }
    return result;
  }

  getPieChartColor(): string[] {
    var result: string[] = [];
    if(this.type=='Feedbacks')
      result = ['#4CAF50', '#F44336', 'gold', '#2196F3'];
    if(this.type=='Gender')
      result = ['#2196F3', '#FF69B4'];
    return result;
  }

  getLabelColor(): string {
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
