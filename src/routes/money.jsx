import React, { Component } from 'react'

import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Filler,
    Tooltip,
    Legend
);

export default class Money extends Component {
    constructor(props) {
        super(props);

        this.state = {
            month: 7,
            year: 2024,
            data : null,
        };
    }

    async componentDidMount() {
        let data = await fetch(process.env.PUBLIC_URL + '/ynab.json').then(response => response.json());
        this.setState({ data : data });
    }

	render() {
        if(this.state.data == null) return <p>Loading...</p>;

        // const data = this.state.data[this.state.year][this.state.month];

        const categories = Object.keys(this.state.data[this.state.year][this.state.month]["categories"]);
        const values = categories.map(label => Math.max(this.state.data[this.state.year][this.state.month]["categories"][label]["budgeted"] / 1000, 0));

        const doughnut_data = {
            datasets: [{
                data: values,
                // backgroundColor: [
                //     'rgba(255, 99, 132, 1)',
                //     'rgba(0, 99, 255, 1)',
                //     'rgba(0, 255, 132, 1)',
                // ],
                // borderColor: [
                //     'rgba(255, 99, 132, 1)',
                //     'rgba(0, 99, 255, 1)',
                //     'rgba(0, 255, 132, 1)',
                // ],
                borderWidth: 1,
            }],

            labels: categories,
        };

        // income vs budgeted for month in year
        var timeline_data = {}
        for(const year in this.state.data) {
            for(const month in this.state.data[year]) {
                const date_string = year.toString() + "-" + month;
                timeline_data[date_string] = this.state.data[year][month];
            }
        }

        const line_data = {
            datasets: [
                {
                    label: 'income',
                    fill: true,
                    data: Object.keys(timeline_data).map(ts => timeline_data[ts]["income"] / 1000),
                    borderWidth: 1,
                    backgroundColor: 'rgba(0, 0, 255, 0.5)',
                },
                {
                    label: 'spending',
                    fill: true,
                    data: Object.keys(timeline_data).map(ts => timeline_data[ts]["budgeted"] / 1000),
                    borderWidth: 1,
                    backgroundColor: 'rgba(255, 0, 0, 0.5)',
                },
            ],

            labels: Object.keys(timeline_data),
        };

        return (
            <div>
                <div style={{display: 'flex', width: '100vw', height: '75vh'}}>
                    <div style={{width: '50vw'}}>
                        <Doughnut data={doughnut_data} />
                    </div>
                    <div style={{width: '50vw'}}>
                        <Doughnut data={doughnut_data} />
                    </div>
                </div>
                <div sytle={{width: '100vw', height: '25vh'}}>
                    <Line data={line_data} height={"100%"} options={{ maintainAspectRatio: false }}/>
                </div>
            </div>
        )

		// return (
        //         <div style={{display: 'flex'}}>
        //             <div style={{width: '45vw'}}>
        //                 <Doughnut width={"45%"} data={doughnut_data} />
        //             </div>
        //             <div style={{width: '45wv'}}>
        //                 <Doughnut width={"45%"} data={doughnut_data} />
        //             </div>
        //         <div style={{height: '25vh'}}>
        //              <Line data={line_data} />
        //         </div>
        //         </div>
		// )
	}
}
