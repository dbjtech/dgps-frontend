import React, { Component } from 'react'
import { Row, Col } from 'antd'
import axios from 'axios'

import SideSelect from './components/SideSelect.jsx'
import GLChart from './components/GLChart.jsx'
import LineChart from './components/LineChart.jsx'

import styles from './index.module.css'

export default class Home extends Component {
	// 别动，否则每次渲染都要重新计算
	isLargeScreen = window.innerWidth > 768

	state = { group_list: [], device_list: [], measure_data_list: [] }

	componentDidMount() {
		axios
			.get(`/group`)
			.then((res) => {
				const group_list = res.data
				console.log(group_list)
				this.setState({ group_list })
			})
			.catch((err) => console.log(err))

		axios
			.get(`/device`)
			.then((res) => {
				const device_list = res.data
				console.log(device_list)
				this.setState({ device_list })
			})
			.catch((err) => console.log(err))

		axios
			.get(`/measure`)
			.then((res) => {
				const measure_data_list = res.data
				console.log(measure_data_list)
				this.setState({ measure_data_list })
			})
			.catch((err) => console.log(err))
	}

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
