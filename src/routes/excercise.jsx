import React, { Component } from 'react';
import { Link } from "react-router-dom";

import { Card, Carousel, Col, Row } from 'antd';

import ActivityChart from "../component/ActivityChart.js";
import LiftChart from "../component/LiftChart.js";
import StreakGrid from "../component/StreakGrid.js";

export default class Excercise extends Component {
	render() {
    return (
      <div>
        <Carousel arrows infinite={false}>
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Card title="MMA" bordered={false}>
                  <StreakGrid filename={"mma.json"} heat={"duration"} color={"blue"}/>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Running" bordered={false}>
                  <StreakGrid filename={"run.json"} heat={"distance"} color={"green"}/>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Strength" bordered={false}>
                  <StreakGrid filename={"lifting.json"} heat={"duration"} color={"pink"}/>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Yoga" bordered={false}>
                  <StreakGrid filename={"yoga.json"} heat={"duration"} color={"purple"}/>
                </Card>
              </Col>
            </Row>
          </div>
          <div>
            <p>2</p>
          </div>
        </Carousel>
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <ActivityChart />
            </Col>
            <Col span={12}>
              <LiftChart />
            </Col>
          </Row>
        </div>
      </div>
    )
	}
}
