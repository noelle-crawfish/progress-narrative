import React, { Component } from 'react'

import { useNavigate, redirect } from "react-router-dom";

import type { MenuProps } from 'antd';
import { Menu } from "antd";

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  { label: 'Overview', key: 'overview' },
  {
    label: 'Health',
    key: 'health-submenu',
    children: [
      { label: 'Excercise', key: 'excercise' },
      { label: 'Nutrition', key: 'nutrition' },
      { label: 'Health Stats', key: 'health-stats' },
    ],
  },
  {
    label: 'Time',
    key: 'time-submenu',
    children: [
      { label: 'Calendar', key: 'calendar' },
      { label: 'Productivity', key: 'productivity' },
      { label: 'Social', key: 'social' },
    ],
  },
  { label: 'Money', key: 'money' },
  { label: 'Datasheet', key: 'datasheet' },
];

export default class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  async componentDidMount() {

  }


  render() {
    const onClick: MenuProps['onClick'] = (e) => {
      console.log('click ', e);
      console.log('click ', e.key);
      if(e.key === 'overview') {
        window.location = "#/";
      } else window.location = "#/" + e.key; // this works :)
    };

    return (
      <div>
        <Menu onClick={onClick} items={items} mode='horizontal' />
      </div>
    );
  }
}
