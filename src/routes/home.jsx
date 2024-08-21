import React, { Component } from 'react';
import { Link } from "react-router-dom";

import StreakGrid from "../component/StreakGrid.js";
import Demo from "../component/Demo.js";

export default class Home extends Component {
	render() {
		return (
            <div>
               <p>Homepage, insert interesting stuff here</p>
                <ul>
                    <li><Link to="/excercise">Health</Link></li>
                    <li><Link to="/nutrition">Nutrition</Link></li>
                    <li><Link to="/time">Time</Link></li>
                    <li><Link to="/money">Money</Link></li>
                    <li><Link to="/social">Social</Link></li>
                    <li><Link to="/datasheet">Datasheet</Link></li>
                </ul>
                <StreakGrid />
            </div>
		)
	}
}
