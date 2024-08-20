import React, { Component } from 'react';
import { Link } from "react-router-dom";

import MacroBar from "../component/MacroBar.js";
import CalorieChart from "../component/Calories.js";

export default class Nutrition extends Component {
    // breakdown of carbs, fat, protien
    // calories over time -> line for weight over time on same graph
    // top sources of calories over time (avg. / day?, ranked)
    // average cost of food / day

	render() {
		return (
            <div>
                <CalorieChart />
                <MacroBar />
            </div>
		)
	}
}
