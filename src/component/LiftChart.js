
import React, { Component } from 'react';

import { Select } from 'antd';

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

export default class LiftChart extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selection: "Back Squat",
      dates: [],
      data: {
        "Back Squat": {
          unit: "Weight (lbs)",
          value: [],
        },
        "Bench Press": {
          unit: "Weight (lbs)",
          value: [],
        },
        "Deadlift": {
          unit: "Weight (lbs)",
          value: [],
        },
        "Front Squat": {
          unit: "Weight (lbs)",
          value: [],
        },
        "Overhead Press": {
          unit: "Weight (lbs)",
          value: [],
        },
        "Overhead Squat": {
          unit: "Weight (lbs)",
          value: [],
        },
        "Pull Up (BW)": {
          unit: "Reps",
          value: [],
        },
        "Pull Up (Weighted)": {
          unit: "Weight (lbs)",
          value: [],
        },
      },
    };
  }

  async componentDidMount() {
    let lift_data = await fetch(process.env.PUBLIC_URL + "/excercise/lifting.json").then(response => response.json());

    let data = {
      "Back Squat": {
        unit: "Weight (lbs)",
        value: [],
      },
      "Bench Press": {
        unit: "Weight (lbs)",
        value: [],
      },
      "Deadlift": {
        unit: "Weight (lbs)",
        value: [],
      },
      "Front Squat": {
        unit: "Weight (lbs)",
        value: [],
      },
      "Overhead Press": {
        unit: "Weight (lbs)",
        value: [],
      },
      "Overhead Squat": {
        unit: "Weight (lbs)",
        value: [],
      },
      "Pull Up (BW)": {
        unit: "Reps",
        value: [],
      },
      "Pull Up (Weighted)": {
        unit: "Weight (lbs)",
        value: [],
      },
    };

    for(const date in lift_data) {
      for(const lift in lift_data[date][0]) {
        if(lift === "duration") continue; // hacky but needed
        data[lift]["value"].push(lift_data[date][0][lift]);
      }
    }

    this.setState({ dates : Object.keys(lift_data) });
    this.setState({ data : data });
  }

  // TODO : do I want a placeholder or default to start
  render() {
    const select_options = Object.keys(this.state.data).map((lift) => [{value: lift, label: lift}][0]);
    const onChange = (value: string) => { this.setState({ selection : value }); };
    // TODO can I pull directly from garmin updates to 1RM? Or do I need to search strength logs

    const line_options = {
      spanGaps: true,
    }
    const line_data = {
        datasets: [
          {
            label: this.state.data[this.state.selection].unit,
            fill: false,
            data: this.state.data[this.state.selection]["value"],
            borderWidth: 1,
            borderColor: "#FF0000FF",
            yAxisID: 'steps',
          },
        ],
      labels: this.state.dates,
    };

    // TODO I think change the selecter to just add lifts / remove instead of ..
    return (
      <div>
        <Select
            showSearch
          popupMatchSelectWidth={true}
          defaultValue={this.state.selection}
          onChange={onChange}
            filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          options={select_options}
        />
        <Line options={line_options} data={line_data} />
      </div>
    );
  }


}
