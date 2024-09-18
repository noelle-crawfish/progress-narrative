import React, { Component } from 'react';

import SleepChart from "../component/SleepChart.js";
import HRChart from "../component/HRChart.js";

export default class HealthStats extends Component {
	render() {
		return (
            <div>
                <SleepChart />
                <HRChart />
            </div>
		)
	}
}
