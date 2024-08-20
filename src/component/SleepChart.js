
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
import { Chart } from 'react-chartjs-2';

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

export default class SleepChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
    };
  }

  async componentDidMount() {
    let health_data = await fetch(process.env.PUBLIC_URL + "/garmin.json").then(response => response.json());
    console.log(health_data);
    this.setState({ data : health_data });
  }

  render() {

    const options = {
      stacked: false,
      scales: {
        duration: {
          type: 'linear',
          display: true,
          position: 'left',
        },
        score: {
          type: 'linear',
          display: true,
          position: 'right',
          min: 0,
          max: 100,
          grid: {
            drawOnChartArea: false,
          },
        },
      }
    }

    const data = {
      datasets: [
        {
          type: "line",
          label: "Sleep Score",
          fill: false,
          data: Object.keys(this.state.data).map(key => this.state.data[key]["sleep_score"]),
          borderWidth: 2,
          borderColor: "#000000FF",
          yAxisID: 'score',
        },
        {
          type: "bar",
          label: "Sleep Duration",
          fill: false,
          data: Object.keys(this.state.data).map(key => this.state.data[key]["sleep_duration"] / 60), // hours
          borderWidth: 2,
          borderColor: "#000000FF",
          yAxisID: 'duration',
        },
      ],
      labels: Object.keys(this.state.data),
    }

    return (
      <div>
        <Chart type='bar' options={options} data={data} />
      </div>
    );
  }
}
