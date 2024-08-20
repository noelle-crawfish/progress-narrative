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

export default class ActivityChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {}
        };
    }

    async componentDidMount() {
        let health_data = await fetch(process.env.PUBLIC_URL + "/garmin.json").then(response => response.json());
        this.setState({ data : health_data });
    }

    render() {
        const options = {
            stacked: false,
            scales: {
                steps: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                },
                intensity_min: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                },
            },
        };

        const line_data = {
            datasets: [
                {
                    label: "Steps",
                    fill: false,
                    data: Object.keys(this.state.data).map(key => this.state.data[key]["steps"]),
                    borderWidth: 1,
                    borderColor: "#FF0000FF",
                    yAxisID: 'steps',
                },
                {
                    label: "Intensity Min.",
                    fill: false,
                    data: Object.keys(this.state.data).map(key => this.state.data[key]["intensity_min"]),
                    borderWidth: 1,
                    borderColor: "#0000FFFF",
                    yAxisID: 'intensity_min',
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
