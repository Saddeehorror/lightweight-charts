import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { createChart } from 'lightweight-charts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'lightweight-charts';
  chart:any
  lineSeries:any
  chartData:any


  ngOnInit(): void {
    this.chart = createChart('chart-container',{ height:300,   grid:{
      vertLines:{
        visible:false
      },
      horzLines: {
        visible: false,
      },

    }});
    this.chart.applyOptions({
      rightPriceScale: {
          visible: false,
      },
      leftPriceScale: {
          visible: false,
      },
  });
    this.lineSeries = this.chart.addAreaSeries({
      topColor: '#a9ff9e',
    bottomColor: 'white',
    crosshairMarkerVisible:true,
    pointMarkersVisible:false,
    crosshairMarkerBackgroundColor: 'black',
    // crosshairMarkerLineVisible:false
    // crosshairMarkerRadius: 0, // Establecemos el radio del marcador a 0 para que no sea visible
    // crosshairMarkerBorderColor: 'transparent', // Establecemos el borde del marcador a transparente
    // crosshairMarkerBackgroundColor: 'transparent', // Establecemos el color de fondo del marcador a transparente
    // crosshairMarkerLineWidth: 0, // Establecemos el ancho de línea del marcador a 0 para que no sea visible
    // crosshairMarkerHorizontalLineColor: 'transparent', // Establecemos el color de línea horizontal a transparente
    // crosshairMarkerVerticalLineColor: 'transparent' // Establecemos el color de línea vertical a transparente
    // guideLinesVisible:false,
    });

    this.chart.timeScale().applyOptions({
      linesVisible:true,
      visible:false
    })

    // this.chart.priceScale().applyOptions({
    //   linesVisible:false,
    // });

    // this.chart.priceScale().applyOptions({
    //   borderVisible:false
    // });

    // this.chart.timeScale().applyOptions({
    //   horzLinesVisible: false, // Oculta las líneas horizontales del eje de tiempo (eje x)
    //   vertLinesVisible: false // Oculta las líneas verticales del eje de precio (eje y)

    // });
    
    // this.chart.priceScale().applyOptions({
    //   vertLinesVisible: false // Oculta las líneas verticales del eje de precio (eje y)
    // });

    this.chartData = this.generateBitcoinData(2)
    this.lineSeries.setData(this.chartData);
    this.chart.timeScale().fitContent();

    const cardContainer = document.getElementById('card-container');

    if (cardContainer) {
      window.addEventListener('resize', () => {
        this.chart.resize(cardContainer.offsetWidth - 50, 300);
    });
    }



    this.chart.subscribeCrosshairMove((param:any) => {
      // if (param !== null && param.time) {
      //   const index = param.point?.x;
      //   const price = param.point?.y;
      //   const tooltip = document.getElementById('custom-tooltip');
      //   if (tooltip) {
      //     const chartindex = this.chartData.findIndex((item:TData) => item.time === param.time);
      //     tooltip.style.left = `${index}px`;
      //     tooltip.style.top = `${(price)?price-70:0}px`;
      //     tooltip.innerHTML = `Fecha: ${this.formatUnixTime(this.chartData[chartindex].time)}<br>Valor: $${this.chartData[chartindex].value.toFixed(2)} MXN`;
      //     tooltip.style.display = 'block';
      //     tooltip.style.zIndex = '1000';
      //   }
      // }




    });

    this.chart.subscribeClick((param:any) => {
      if (param !== null && param.time) {
        const index = param.point?.x;
        const price = param.point?.y;
        const tooltip = document.getElementById('custom-tooltip');
        if (tooltip) {
          const chartindex = this.chartData.findIndex((item:TData) => item.time === param.time);
          tooltip.style.left = `${index}px`;
          tooltip.style.top = `${(price)?price-70:0}px`;
          tooltip.innerHTML = `Fecha: ${this.formatUnixTime(this.chartData[chartindex].time)}<br>Valor: $${this.chartData[chartindex].value.toFixed(2)} MXN`;
          tooltip.style.display = 'block';
          tooltip.style.zIndex = '1000';
        }
      }

    });

    setTimeout(() => {
      this.newValues();
    }, 7000);
  }

  newValues(){
    let newValue = this.generateBitcoinData(2)
    console.log(newValue);
    this.chartData.push(...newValue);
    this.chartData.sort((a:any, b:any) => a.time - b.time);

    this.lineSeries.setData(this.chartData);
    this.chart.timeScale().fitContent();

    setTimeout(() => {
      this.newValues();
    }, 7000);
  }

  generateBitcoinData(count: number): TData[] {
    const data: TData[] = []
    let currentDate = new Date();
    let currentValue = Math.random() * 10000; // Precio inicial aleatorio

    for (let i = 0; i < count; i++) {
      const change = (Math.random() - 0.5) * 100; // Cambio aleatorio entre -50 y 50
      currentValue += change;
      const time = Math.floor(currentDate.getTime() / 1000);

      data.push({ time, value: currentValue });
      currentDate.setSeconds(currentDate.getSeconds() + 5);

    }

    return data;
  }

  formatDate(date: Date): string {

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  
  
    formatUnixTime(unixTime: number): string {
      // Crear un objeto Date usando el tiempo Unix (en milisegundos)
      const date = new Date(unixTime * 1000);
      
      // Array con los nombres de los meses
      const monthNames = [
        'ene', 'feb', 'mar', 'abr', 'may', 'jun',
        'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
      ];
    
      // Obtener el día, mes y año
      const day = date.getDate();
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear() % 100; // Solo los últimos dos dígitos del año
    
      // Obtener la hora, minutos y segundos
      const hours = ('0' + date.getHours()).slice(-2);
      const minutes = ('0' + date.getMinutes()).slice(-2);
      const seconds = ('0' + date.getSeconds()).slice(-2);
    
      // Formatear la fecha y hora según el formato deseado
      return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}h`;
    }
  
    filterData(period: string) {
      // Obtener la fecha actual en milisegundos
      const currentTime = new Date().getTime();
    
      // Definir variables para almacenar la fecha de inicio y fin del período de tiempo
      let startDate: number;
      let endDate: number = currentTime;
    
      // Calcular la fecha de inicio del período de tiempo según el período seleccionado
      switch (period) {
        case '1d':
          startDate = currentTime - (1 * 24 * 60 * 60 * 1000); // 1 día en milisegundos
          break;
        case '1s':
          startDate = currentTime - (604800000); // 1 segundo en milisegundos
          break;
        case '1m':
          startDate = currentTime - (60 * 1000); // 1 minuto en milisegundos
          break;
        case '3m':
          startDate = currentTime - (3 * 30 * 24 * 60 * 60 * 1000); // 3 meses en milisegundos (aproximado)
          break;
        case '1y':
          startDate = currentTime - (365 * 24 * 60 * 60 * 1000); // 1 año en milisegundos (aproximado)
          break;
        case '3y':
          startDate = currentTime - (3 * 365 * 24 * 60 * 60 * 1000); // 3 años en milisegundos (aproximado)
          break;
        default:
          // Si el período seleccionado no coincide con ninguno de los casos anteriores, no se aplica ningún filtro
          startDate = 0;
          break;
      }
    
      // Filtrar los datos según el período de tiempo seleccionado
      const filteredData = this.chartData.filter((item:any) => item.time * 1000 >= startDate && item.time * 1000 <= endDate);
    
      // Utiliza los datos filtrados según tus necesidades (por ejemplo, actualiza el gráfico con los datos filtrados)
      console.log('Datos filtrados:', filteredData);
      this.lineSeries.setData(filteredData);
      this.chart.timeScale().fitContent();
  
    }


    isUp():boolean{
      let isUp = true;

      if((this.chartData[this.chartData.length - 1].value - this.chartData[this.chartData.length - 2].value) > 0){
        isUp = true;
      }else{
        isUp = false;
      }

      return isUp
    }

    getPercentChange(){
      let dif = this.chartData[this.chartData.length - 1].value - this.chartData[this.chartData.length - 2].value
      let percent = (dif*100)/this.chartData.length - 1
      return percent
    }



}

interface TData {
  time: number;
  value: number;
}