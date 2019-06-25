import React, { Component } from 'react'
import { Row, Col } from 'antd'

import SideSelect from './components/SideSelect.jsx'
import GLChart from './components/GLChart.jsx'
import SideMenu from './components/SideMenu.jsx'
import LineChart from './components/LineChart.jsx'

import styles from './index.module.css'

export default class Home extends Component {
	render() {
		return (
			<div className={styles.container}>
				<Row>
					<Col xs={24} md={0}>
						{/* TODO: 基准点查询/选中 */}
						<SideSelect />
						{/* <p className={styles.p}>注：可直接搜索要选中的点</p> */}
					</Col>
				</Row>
				<Row>
					<Col xs={0} md={8}>
						{/* TODO: 根据后端请求的数据渲染列表 */}
						<SideMenu />
					</Col>
					<Col xs={24} md={16} className={styles.division}>
						{/* TODO: 根据用户选择的点渲染图像 */}
						<GLChart />
					</Col>
				</Row>
				<Row>
					<Col xs={24} md={0}>
						{/* TODO: 目标点查询/选中 */}
						<SideSelect />
					</Col>
				</Row>
				<Row>
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
