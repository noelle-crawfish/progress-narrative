import { Component } from 'react'
// import './App.css'

import {
  Chart as ChartJS,

  BarElement,
  CategoryScale,
    Filler,
  Legend,
  LinearScale,
    LineElement,
    PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  BarElement,
  CategoryScale,
    Filler,
    Legend,
  LinearScale,
    LineElement,
    PointElement,
  Title,
  Tooltip,
);

// other charts
// vices -> 

class CaloriesInOutChart extends Component {

    constructor(props) {
	super(props);

	this.state = {
	    options: {
		stacked: false,
		spanGaps: true,
		scales: {
		    calories: {
			type: 'linear',
			display: true,
			position: 'left',
		    },
		    weight: {
			type: 'linear',
			display: true,
			position: 'right',
		    },
		},
	    },
	}
    }

    render() {
	const data = {
	    labels: Object.keys(this.props.nutrition_data),
	    datasets: [
		{
		    label: "Calories In",
		    fill: true,
		    data: Object.keys(this.props.nutrition_data).map(key => this.props.nutrition_data[key]["Energy (kcal)"]),
		    borderWidth: 1,
		    backgroundColor: "#FF000050",
		    yAxisID: 'calories',
		},
		{
		    label: "Calories Out",
		    fill: true,
		    data: Object.keys(this.props.health_data).map(key =>
			this.props.health_data[key]["calories_bmr"] +
			    this.props.health_data[key]["calories_active"]),
		    borderWidth: 1,
		    backgroundColor: "#0000FF50",
		    yAxisID: 'calories',
		},
		{
		    label: "Weight",
		    fill: false,
		    data: Object.keys(this.props.health_data).map(key => this.props.health_data[key]["weight"]),
		    borderWidth: 2,
		    backgroundColor: "#000000FF",
		    yAxisID: 'weight',
		},
	    ],
	}

	return (
	    <Line options={this.state.options} data={data} />
	)
    }
}

class MacroChart extends Component {

    static cal_per_g = {
	"Protein": 4, 
	"Carbs": 4,
	"Fat": 9,
	"Alcohol": 7,
    }

    constructor(props) {
	super(props);

	this.state = {
	    data: {},
	    options: {
		scales: {
		    x: {
			stacked: true,
		    },
		    y: {
			stacked: true,
		    },
		},
		plugins: {
		    tooltip: {
			enabled: true,
			callbacks: {
			    label: (tooltipItem) => {
				let calories = tooltipItem.raw
				let label = tooltipItem.dataset.label
				let grams = calories / MacroChart.cal_per_g[label]
				return `${label}: ${grams.toFixed(2)}g (${calories.toFixed(0)} cal)`
			    },
			},
		    },
		},
	    },
	};
    }

    render() {
	const labels = Object.keys(this.props.data);
	const data = {
	    labels,
	    datasets: [
		{
		    label: "Protein",
		    data: Object.keys(this.props.data).map(key =>
			this.props.data[key]["Protein (g)"]*MacroChart.cal_per_g["Protein"]), // 4 calories per gram of protien
		    backgroundColor: "#FF0000"
		},
		{
		    label: "Carbs",
		    data: Object.keys(this.props.data).map(key =>
			this.props.data[key]["Carbs (g)"]*MacroChart.cal_per_g["Carbs"]), // 4 calories per gram of carbs
		    backgroundColor: "#0000FF"
		},
		{
		    label: "Fat",
		    data: Object.keys(this.props.data).map(key =>
			this.props.data[key]["Fat (g)"]*MacroChart.cal_per_g["Fat"]), // 9 calories per gram of fat
		    backgroundColor: "#00FF00"
		},
		{
		    label: "Alcohol",
		    data: Object.keys(this.props.data).map(key =>
			this.props.data[key]["Alcohol (g)"]*MacroChart.cal_per_g["Alcohol"]), // 7 calories per gram of alcohol
		    backgroundColor: "#FFFF00"
		},
	    ]
	}
	
	return (
	    <div>
		<Bar options={this.state.options} data={data} />
	    </div>
	)
    }

}

export default class Nutrition extends Component {

    constructor(props) {
	super(props)
	this.state = {
	    nutrition_data: {},
	    health_data: {},
	}
    }

    async componentDidMount() { 
	const nutrition_filename = "cronometer.json"
	let nutrition_data = await fetch(nutrition_filename).then(response => response.json())
	this.setState({ nutrition_data : nutrition_data })

	const health_filename = "health.json"
	let health_data = await fetch(health_filename).then(response => response.json())
	this.setState({ health_data : health_data })
    }

    render() {
	return (
	    <div>
		<MacroChart data={this.state.nutrition_data} />
		<CaloriesInOutChart nutrition_data={this.state.nutrition_data} health_data={this.state.health_data} />
	    </div>
	)
    }
}
