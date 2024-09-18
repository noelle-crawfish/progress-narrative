import React, { Component } from 'react';

import { Tooltip } from 'react-tooltip';
import CalendarHeatmap from 'react-calendar-heatmap';
// import (process.env.PUBLIC_URL + '/react-calendar.css');
import './../styles/react-calendar.css';

export default class StreakGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      filename: props.filename,
      heat: props.heat,
      thresholds: props.thresholds,
      color: props.color,
    };
  }

  async componentDidMount() {
    let data = await fetch(process.env.PUBLIC_URL + "/excercise/" + this.state.filename).then(response => response.json());
    this.setState({ data : data });
  }

  render() {

    let values = [];
    let min = 6969420;
    let max = 0;

    for(const date in this.state.data) {
      let dist = 0;
      for(const run_idx in this.state.data[date]) dist += this.state.data[date][run_idx][this.state.heat];
      min = Math.min(min, dist);
      max = Math.max(max, dist);
      values.push({date: date, heat: dist});
    }
    // console.log(this.state.filename + " " + values.hear);
    const thresholds = [min, (2*min + max) / 3, (min + max) / 2, (min + 2*max) / 3, max]

    return (
      <div>
        <CalendarHeatmap
          startDate={new Date('2024-01-01')}
          endDate={new Date('2024-12-31')}
          values={values}
          classForValue={
            (value) => {
              if(!value) return 'color-empty';

              let heat = 0;
              for(let i = 0; i < thresholds.length; ++i) {
                if(value.heat < thresholds[i]) {
                  heat = i;
                  break;
                }
              }

              return ('color-' + this.state.color + '-' + heat);
            }
          }
          tooltipDataAttrs={ (value) => {return {'data-tip': 'Hello'};} }
          onClick={
            // do nothing for now
            (value) => {
              if(!value) return;
            }
          }
        />
        <Tooltip id={'data-tip'}/>
      </div>
    );
  }

}
