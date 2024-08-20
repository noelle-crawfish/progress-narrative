
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

export default class HRChart extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: {},
    };
  }

  async componentDidMount() {
    let health_data = await fetch(process.env.PUBLIC_URL + "/garmin.json").then(response => response.json());
    this.setState({ data : health_data });
  }

  render() {
    const line_data = {
      datasets: [
        {
          label: "Max. HR",
          fill: false,
          data: Object.keys(this.state.data).map(key => this.state.data[key]["max_hr"]),
          borderWidth: 1,
          borderColor: "#FF0000FF",
        },
        {
          label: "Min. HR",
          fill: false,
          data: Object.keys(this.state.data).map(key => this.state.data[key]["min_hr"]),
          borderWidth: 1,
          borderColor: "#0000FFFF",
        },
        {
          label: "Resting HR",
          fill: false,
          data: Object.keys(this.state.data).map(key => this.state.data[key]["rhr"]),
          borderWidth: 1,
          borderColor: "#000000FF",
        },
      ],
      labels: Object.keys(this.state.data),
    }

    return (
      <div>
        <Line data={line_data} />
      </div>
    );
  }
}
