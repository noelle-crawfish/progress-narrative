import React, { Component } from 'react';

import { Tooltip } from 'react-tooltip';
import CalendarHeatmap from 'react-calendar-heatmap';
// import (process.env.PUBLIC_URL + '/react-calendar.css');
import './../styles/react-calendar.css';

export default class MoodGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
    };
  }

  async componentDidMount() {
    let data = await fetch(process.env.PUBLIC_URL + "/daylio.json").then(response => response.json());
    this.setState({ data : data });
  }

  render() {

    let values = [];
    for(const date in this.state.data) {
      values.push({date: date, count: this.state.data[date]["mood"],
                   activities: this.state.data[date]["activities"], notes: this.state.data[date]["note"]});
    }

    return (
      <div>
        <CalendarHeatmap
          startDate={new Date('2024-01-01')}
          endDate={new Date('2024-12-31')}
          values={values}
          classForValue={
            (value) => {
                if(!value) return 'color-empty';
                return ('color-daylio-' + value.count);
            }
          }
          tooltipDataAttrs={ (value) => {return {'data-tip': 'Hello'};} }
          onClick={
            (value) => {
              if(!value) return;
              alert("Activities: " + value.activities + "\nNotes: " + value.notes);
            }
          }
        />
        <Tooltip id={'data-tip'}/>
      </div>
    );
  }

}
