import { Component } from 'react'
// import './App.css'

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

class MacroBar extends Component {
    constructor(props) {
	super(props);

	this.state = {
	    data: {},
	};
    }

    async componentDidMount() {
	const filename = "cronometer.json"

	let data = await fetch(filename).then(response => response.json());
	// console.log(data);
    }

    render() {
	return <h1>Macro Bar Chart</h1>
    }

}

export default class Nutrition extends Component {
    render() {
	return (
	    <div>
		<MacroBar />
	    </div>
	)
    }
}
