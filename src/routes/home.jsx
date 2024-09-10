import React, { Component } from 'react';
import { Link } from "react-router-dom";

import StreakGrid from "../component/StreakGrid.js";
import Demo from "../component/Demo.js";

export default class Home extends Component {

	render() {
		return (
            <div>
                <p>Homepage, insert interesting stuff here</p>
                <StreakGrid />
            </div>
		)
	}
}
