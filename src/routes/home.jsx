import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class Home extends Component {
	render() {
		return (
            <div>
               <p>Homepage, insert interesting stuff here</p>
                <ul>
                    <li><Link to="/time">Time</Link></li>
                    <li><Link to="/money">Money</Link></li>
                    <li><Link to="/social">Social</Link></li>
                    <li><Link to="/datasheet">Datasheet</Link></li>
                </ul>
            </div>
		)
	}
}
