import React, { Component } from 'react';
import { Link } from "react-router-dom";

import SleepChart from "../component/SleepChart.js";
import HRChart from "../component/HRChart.js";
import ActivityChart from "../component/ActivityChart.js";

export default class Excercise extends Component {
	render() {
		return (
            <div>
                <ActivityChart />
                <HRChart />
                <SleepChart />
            </div>
		)
	}
}
