import React, { Component } from 'react'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Filler,
    Tooltip,
    Legend
);

export default class CalorieChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {}
    };
  }

  async componentDidMount() {
    let data = await fetch(process.env.PUBLIC_URL + "/cronometer.json").then(response => response.json());
    let health_data = await fetch(process.env.PUBLIC_URL + "/garmin.json").then(response => response.json());

    for(const date in health_data) {
      data[date] = {...data[date], ...health_data[date]};
    }

    this.setState({ data : data });
  }

  render() {

    const options = {
      stacked: false,
      spanGaps: true,
      scales: {
        calories: {
          type: 'linear',
          display: true,
          position: 'left',
        },
        weight: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false,
          },
        }
      }
    }

    const line_data = {
      datasets: [
        {
          label: "Calories In",
          fill: true,
          data: Object.keys(this.state.data).map(key => this.state.data[key]["Energy (kcal)"]),
          borderWidth: 1,
          backgroundColor: "#FF000050",
          yAxisID: 'calories',
        },
        {
          label: "Calories Out",
          fill: true,
          data: Object.keys(this.state.data).map(key => this.state.data[key]["calories"]),
          borderWidth: 1,
          backgroundColor: "#0000FF50",
          yAxisID: 'calories',
        },
        {
          label: "Weight",
          fill: false,
          data: Object.keys(this.state.data).map(key => this.state.data[key]["weight"]),
          borderWidth: 2,
          borderColor: "#000000FF",
          yAxisID: 'weight',
        },
      ],

      labels: Object.keys(this.state.data),
    };

    return (
      <div>
        <Line options={options} data={line_data} />
      </div>
    );
  }

}
