import { Component, inject, signal } from '@angular/core';
import { SocketService } from '../service/socketService';


import ApexCharts from 'apexcharts/ssr'
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-temperatura',
  imports: [BaseChartDirective],
  templateUrl: './temperatura.html',
  styleUrl: './temperatura.css',
})
export class Temperatura {
  arduino = inject(SocketService);
 public chartData = signal<ChartData<'line'>>({
    labels: [],
    datasets: [{ data: [], label: 'Ventas en Vivo', tension: 0.4 }]
  });
  public chartType: ChartType = 'line';
  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: { duration: 0 } // Animación fluida
  };

  fecha():string{
    const f=(new Date());
    return  f.getDay().toString()+'/'
    +(new Date()).getMonth()+'/'
    +(new Date()).getFullYear()+'  '
    +(new Date()).getHours()+':'
    +(new Date()).getMinutes()+':'
    +(new Date()).getSeconds()
  }
  constructor(){ 
    this.arduino.listen('temperatura').subscribe(dat=>{
      console.log("");

    });
    setInterval(() => {
      //console.log("ac",this.datosTemp())
      //this.datosTemp.update(val=>[...val,Math.random()%100])
      //this.tiempo.update(val=>[...val,Date()])
      //console.log( this.fecha());
      this.chartData.update(current => {
        const newLabels = [...(current.labels || []), this.fecha()];
        const newData = [...current.datasets[0].data,Math.random()%100 ];

        // Mantener solo los últimos 15 registros para fluidez
        if (newLabels.length > 15) {
          newLabels.shift();
          newData.shift();
        }

        // Retornamos un nuevo objeto (Inmutabilidad)
        return {
          labels: newLabels,
          datasets: [{ ...current.datasets[0], data: newData }]
        };
      });
      
    }, 1000);
  }  
   
 


}
