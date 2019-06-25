import React, { Component } from 'react'
import { Row, Col } from 'antd'

import SideSelect from './components/SideSelect.jsx'
import GLChart from './components/GLChart.jsx'
import SideMenu from './components/SideMenu.jsx'

import styles from './index.module.css'

export default class Home extends Component {
	render() {
		return (
			<div className={styles.container}>
				<Row>
					<Col xs={24} md={0}>
						{/* TODO: 传入 props 以及回调函数 */}
						<SideSelect />
						{/* <p className={styles.p}>注：可直接搜索要选中的点</p> */}
					</Col>
				</Row>
				<Row>
					<Col xs={0} md={8}>
						{/* TODO: 传入 props 以及回调函数 */}
						<SideMenu />
					</Col>
					<Col xs={24} md={16} className={styles.division}>
						{/* TODO: 传入 props 以及回调函数 */}
						<GLChart />
					</Col>
				</Row>
				<Row>
					<Col xs={24} md={0}>
						{/* TODO: 传入 props 以及回调函数 */}
						<SideSelect />
					</Col>
				</Row>
				<Row>
					<Col xs={24} md={6} className={styles.division}>
						折线图
					</Col>
					<Col xs={24} md={6} className={styles.division}>
						折线图
					</Col>
					<Col xs={24} md={6} className={styles.division}>
						折线图
					</Col>
					<Col xs={24} md={6} className={styles.division}>
						折线图
					</Col>
				</Row>
			</div>
		)
	}
}
