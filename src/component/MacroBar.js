
import React, { Component } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default class MacroBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: {},
    };

  }

  async componentDidMount() {
    const filename = "/cronometer.json";

    let data = await fetch(process.env.PUBLIC_URL + filename).then(response => response.json());
    console.log(data);
    this.setState({ data : data });
  }


  render() {
    console.log(Object.keys(this.state.data));

    const options = {
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    };

    const labels = Object.keys(this.state.data);
    const data = {
      labels,
      datasets: [
        {
          label: "Protein (g)",
          data: Object.keys(this.state.data).map(key => this.state.data[key]["Protein (g)"]),
          backgroundColor: "#FF0000"
        },
        {
          label: "Carbs (g)",
          data: Object.keys(this.state.data).map(key => this.state.data[key]["Carbs (g)"]),
          backgroundColor: "#00FF00"
        },
        {
          label: "Fat (g)",
          data: Object.keys(this.state.data).map(key => this.state.data[key]["Fat (g)"]),
          backgroundColor: "#0000FF"
        },
      ]
    }

    return (
      <div>
        <Bar options={options} data={data} />
      </div>
    );
  }
}
