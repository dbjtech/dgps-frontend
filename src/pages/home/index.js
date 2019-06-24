import React, { Component } from 'react'
import { Row, Col } from 'antd'

import SideSelect from './components/SideSelect.jsx'
import GLChart from './components/GLChart.jsx'

export default class Home extends Component {
	render() {
		return (
			<div>
				<Row>
					<Col xs={24} md={6}>
						{/* TODO: 传入 props 以及回调函数 */}
						<SideSelect />
					</Col>
					<Col xs={0} md={18}>
						<GLChart />
					</Col>
				</Row>
				<Row>
					<Col xs={24} md={0}>
						<GLChart />
					</Col>
				</Row>
			</div>
		)
	}
}
