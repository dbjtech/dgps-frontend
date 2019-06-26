import React, { Component } from 'react'
import { Row, Col } from 'antd'

import SideSelect from './components/SideSelect.jsx'
import GLChart from './components/GLChart.jsx'
import LineChart from './components/LineChart.jsx'

import styles from './index.module.css'

export default class Home extends Component {
	isLargeScreen = window.innerWidth > 768

	render() {
		return (
			<div className={styles.container}>
				<Row>
					{/* TODO: 基准点查询/选中 */}
					<Col xs={0} md={8}>
						{/* 这个是大屏专用，一直 open 的 */}
						<SideSelect isLargeScreen={this.isLargeScreen} />
					</Col>
					<Col xs={24} md={0}>
						{/* 这个是小屏专用 */}
						<SideSelect />
					</Col>
					<Col xs={24} md={16} className={styles.division}>
						{/* TODO: 根据用户选择的点渲染图像 */}
						<GLChart />
					</Col>
				</Row>
				<Row>
					{/* TODO: 根据用户选择的点渲染图像 */}
					<Col xs={24} md={6} className={styles.division}>
						<LineChart />
					</Col>
					<Col xs={24} md={6} className={styles.division}>
						<LineChart />
					</Col>
					<Col xs={24} md={6} className={styles.division}>
						<LineChart />
					</Col>
					<Col xs={24} md={6} className={styles.division}>
						<LineChart />
					</Col>
				</Row>
			</div>
		)
	}
}
