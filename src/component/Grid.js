import React, { Component } from 'react'

import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

import CheckboxTree from 'react-checkbox-tree';
import { Button, Drawer } from 'rsuite';

function read_nodes_from_json(node_json) {
  if(Object.keys(node_json).length === 0) return [];

  let node_list = [];
  for(const key in node_json) {
    node_list.push({
      value : key,
      label : key,
      children : read_nodes_from_json(node_json[key]),
    });
  }

  return node_list;
}

function blend(color1, color2, alpha) {
	let color = (alpha > 0.5) ? color2 : color1;

	alpha = (alpha > 1) ? 1 : alpha;
	alpha = (alpha > 0.5) ? (alpha - 0.5) : (0.5 - alpha);

	let hexString = "#";
	for(let i = 0; i < 3; ++i) {
		let c = Math.round((alpha * color[i]) + ((1 - alpha) * 255));
		let c_hex = c.toString(16);
		hexString += (c_hex.length === 1) ? ("0" + c_hex) : c_hex;
	}

	return hexString;
}

function getColoring(params) {
	const threshold_functions = {
		/********** Time Tracking **********/
		"Productive Min." : (value) => { return blend([255, 0, 0], [0, 255, 0], value / 1000) },
		// social min
		// excercise min
		// leisure

		/********** Nutrition Goals **********/
		// TODO calories
		// low carb TODO adjust these all as consumed / target calories increases
		"Carbs (g)" : (value) => { return blend([0, 255, 0], [255, 0, 0], value / 100); },
		// high protien
		"Protien (g)" : (value) => { return blend([255, 0, 0], [0, 255, 0], value / 200); },
		// low fat
		"Fat (g)" : (value) => { return blend([0, 255, 0], [255, 0, 0], value / 100); },
		// low sugar
		// no alcohol
		// low caffine

		/********** Activity Goals **********/

		/********** Health Statistic Goals **********/
		// HR
		// this is maybe not good
	}

	let label = params.data.label;
	if(params.value == null) {
		// return { color: "#eeeeee" }
		return {backgroundColor: "#000000" };
	} else if(params.value === 0) {
		return {backgroundColor: "#000000" };
	} else if(label in threshold_functions) {
		return {backgroundColor: threshold_functions[params.data.label](params.value) };
	}

	// TODO do something for if there is no value

	return {};

}

export default class Grid extends Component {
	constructor(props) {
		super(props);

		this.state = {
			drawerOpen : true,
			data : null,
            checked : [
				"Resting HR (bpm)",
				"Calories Consumed (kcal)",
				"Productive Min."
            ],
            expanded : [
            ],
			nodes : [],
		};

	}

	async componentDidMount() {
		let data = await fetch('data.json').then(response => response.json());
		let node_json = await fetch('menu_nodes.json').then(response => response.json());

		this.setState({ data : data });

		let nodes = read_nodes_from_json(node_json);
		this.setState({ nodes : nodes }) ;
	}

	render() {

		const gridOptions = {
			autoSizeStrategy: {
				type: 'fitCellContents'
			},
		};

		let rowData = [];

		let dates = [];
		let colDefs = [
			{
				field : "label",
				pinned : 'left',
				headerName : "",
				cellStyle: {'background-color': '#cfcfcf'}
			}, // this is the column containing row 'labels'
		];
		for (const key in this.state.data) {
			colDefs.push({ field : key, cellStyle : (params) => { return getColoring(params) } }); // TODO reverse?
			dates.push(key);
		}

		if(this.state.data != null) {
			// console.log(Object.keys(this.state.data[Object.keys(this.state.data)[0]]));
			let rowLabels = Object.keys(this.state.data[Object.keys(this.state.data)[0]]);
			// let rowLabels = Object.keys(this.state.data);
			for (const idx in rowLabels) {
				let label = rowLabels[idx];
				if(this.state.checked.includes(label)) {
					let row = { label : label }
					for (const date in dates) {
						row[dates[date]] = this.state.data[dates[date]][label];
					}
					rowData.push(row);
				}
			}
		}
		colDefs.push({ field : "7 Day Avg.", pinned : 'right' }); 	// weekly
		colDefs.push({ field : "30 Day Avg.", pinned : 'right' }); 	// monthly
		colDefs.push({ field : "365 Day Avg.", pinned : 'right' });	// yearly
		// console.log(rowData);

		return (
			<div>
				<Button onClick={() => this.setState({ drawerOpen : true })}>Available Values</Button>
				<div
					className="ag-theme-quartz" // applying the grid theme
					style={{ height: 500 }} // the grid will fill the size of the parent container
				>
					<AgGridReact
						rowData={rowData}
						columnDefs={colDefs}
						gridOptions={gridOptions}
					/>
		 		</div>
				<Drawer size={'25rem'} placement={"top"} open={this.state.drawerOpen} onClose={() => this.setState({ drawerOpen : false })}>
					<Drawer.Body>
						<CheckboxTree
							nodes={this.state.nodes}
							checked={this.state.checked}
							expanded={this.state.expanded}
							onCheck={(checked) => this.setState({ checked : checked })}
							onExpand={(expanded) => this.setState({ expanded : expanded })}
						/>
					</Drawer.Body>
				</Drawer>
			</div>
		)
	}
}
