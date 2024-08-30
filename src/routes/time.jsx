import React, { Component } from 'react'

import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler, WeekView, Appointments,
    DateNavigator, TodayButton, Toolbar,
} from '@devexpress/dx-react-scheduler-material-ui';

const projectColors = {
    202873165: '#f0193d', // excercise
    202873184: '#512638', // research
    202873137: '#ff9909', // chores
    202873108: '#ff6600', // progress narrative
    202897898: '#7d7875', // misc.
    null: '#3c3839', // none
};

const Appointment = ({
  children, style, ...restProps
}) => (
  <Appointments.Appointment
    {...restProps}
    style={
          {
              ...style,
              backgroundColor: children[1].props.data['color'],
              borderRadius: '8px',
          }
      }
  >
    {children}
  </Appointments.Appointment>
);

export default class Time extends Component {

    constructor(props) {
        super(props);

        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();


        this.state = {
            // month: 8,
            // year: 2024,
            data: [],
            currentDate: (mm + '-' + dd + '-' + yyyy),
        };
    }

    async componentDidMount() {
        const month = 8;
        const year = 2024;

        const filename = 'toggl-' + year.toString() + '-' + month.toString() + '.json';
        // let raw_data = await fetch(process.env.PUBLIC_URL + '/toggl/months/' + filename).then(response => response);
        let raw_data = await fetch(process.env.PUBLIC_URL + '/toggl/months/' + filename).then(response => response.json());
        console.log(filename);
        console.log(raw_data);

        let data = []
        for(const entry of raw_data) {
            data.push({startDate: entry['start'], endDate: entry['stop'], title: entry['description'], color: projectColors[entry['project_id']]});
        }
        console.log(data);
        this.setState({ data : data });
    }

	render() {
		return (
            <div>
                <Paper>
                    <Scheduler data={this.state.data}>
                        <ViewState currentDate={this.state.currentDate} onCurrentDateChange={(newDate) => {this.setState({ currentDate : newDate })} }/>
                        <WeekView startDayHour={0} endDayHour={24} />

                        <Toolbar />
                        <DateNavigator />
                        <TodayButton />
                        <Appointments appointmentComponent={Appointment}/>
                    </Scheduler>
                </Paper>
            </div>
		);
	}
}
