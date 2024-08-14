import React, { Component } from 'react'

import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, DayView, WeekView, MonthView, Appointments } from '@devexpress/dx-react-scheduler-material-ui';

const currentDate = '2024-08-13';
const schedulerData = [
    { startDate: '2024-08-13T09:45', endDate: '2024-08-13T11:45', title: 'Example Activity' },
];

export default class Time extends Component {

    constructor(props) {
        super(props);

        this.state = {
            month: 8,
            year: 2024,
            data: []
        };
    }

    async componentDidMount() {
        const filename = 'toggl-' + this.state.year.toString() + '-' + this.state.month.toString() + '.json';
        let raw_data = await fetch(process.env.PUBLIC_URL + '/toggl/months/' + filename).then(response => response.json());

        let data = []
        for(const entry of raw_data) {
            // console.log(entry);
            data.push({startDate: entry['start'], endDate: entry['stop'], title: entry['description']});
        }
        console.log(data);
        this.setState({ data : data });
    }

	render() {
                        //<MonthView startDate={'2024-08-01'} />
		return (
            <div>
                <Paper>
                    <Scheduler data={this.state.data}>
                        <ViewState currentDate={currentDate} />
                        <WeekView startDate={'2024-08-11'} startDayHour={4} endDayHour={24} />
                        <Appointments />
                    </Scheduler>
                </Paper>
            </div>
		);
	}
}
