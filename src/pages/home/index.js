import React, { Component } from 'react'
import { Row, Col } from 'antd'
import axios from 'axios'
import moment from 'moment'

import SideSelect from './components/SideSelect.jsx'
import GLChart from './components/GLChart.jsx'
import LineChart from './components/LineChart.jsx'

import styles from './index.module.css'

// 是否为开发模式
const isDebug = false
// const isDebug = true

export default class Home extends Component {
	// 初始化时计算，否则每次渲染都要重新计算
	isLargeScreen = window.innerWidth > 768

	state = {
		group_list: [],
		device_list: [],
		measure_data_list: [],

		// src_dest_list: [],
		d_list: [],
		x_list: [],
		y_list: [],
		z_list: [],
		time_list: [],

		selection: '',
	}

	// 请求后端数据
	componentDidMount() {
		axios
			// .get(`/group`)
			.get(`${isDebug ? '' : 'https://dgps.dbjtech.com'}/group`)
			.then((res) => {
				const group_list = res.data.group_list
				this.setState({ group_list })
			})
			.catch((err) => console.log(err))

		axios
			.get(`${isDebug ? '' : 'https://dgps.dbjtech.com'}/device`)
			.then((res) => {
				const device_list = res.data.device_list
				this.setState({ device_list })
			})
			.catch((err) => console.log(err))

		axios
			// FIXME: 最新数据 test02 都不收敛，取中间一部分进行展示
			.get(
				`${
					isDebug ? '' : 'https://dgps.dbjtech.com'
				}/measure?end_timestamp=1516948892`,
			)
			.then((res) => {
				// 保证数据右边最新
				const measure_data_list = res.data.measure_data_list.reverse()
				// console.log(measure_data_list)

				// const measure_data_list_valid = Array(6).fill([])
				// for (let i = 0; i < measure_data_list_valid.length; i += 1) {
				// 	measure_data_list_valid[i] = measure_data_list.filter(
				// 		(item) => item.valid === i,
				// 	)
				// }
				// console.log(measure_data_list_valid)

				this.setState({ measure_data_list }, () => {
					// 读取数据之后默认展示一组先
					this.changeSelection(
						`${this.state.group_list[0].name}-${this.state.device_list[0].sn}-${
							this.state.device_list[1].sn
						}`,
					)
					// 在此处只调用一次 getTreeData, 避免反复运算
					this.treeData = this.getTreeData()
				})
			})
			.catch((err) => console.log(err))
	}

	// 用于双向绑定选中的点或边
	changeSelection = (selection) => {
		// 避免小屏点击展开时的误触发
		if (!selection) return

		const selectionInfo = selection.split('-')

		if (selectionInfo[2]) {
			const src_dest_list = this.state.measure_data_list.filter(
				(item) =>
					item.src_device_sn === selectionInfo[1] &&
					item.dest_device_sn === selectionInfo[2],
			)
			// this.setState(src_dest_list)

			const d_list = src_dest_list.map((item) => item.d)
			const x_list = src_dest_list.map((item) => item.x)
			const y_list = src_dest_list.map((item) => item.y)
			const z_list = src_dest_list.map((item) => item.z)
			const time_list = src_dest_list.map((item) =>
				moment(item.timestamp * 1000).format(`YYYY-MM-DD HH:mm:ss`),
			)
			this.setState({
				d_list,
				x_list,
				y_list,
				z_list,
				time_list,
			})

			// 用于双向绑定，暂时只能选边
			this.setState({
				selection,
			})
		}
	}

	getTreeData = () => {
		if (this.state.group_list.length && this.state.device_list.length) {
			const treeData = []
			// 分组
			for (let item of this.state.group_list) {
				const name = item.name
				treeData.push({
					title: name,
					key: name,
					value: name,
					children: [],
				})
			}

			// 源点
			for (let item of this.state.device_list) {
				const index = treeData.findIndex(
					(element) => item.group_name === element.title,
				)
				const sn = item.sn
				const keyValue = `${treeData[index].title}-${sn}`
				treeData[index].children.push({
					title: sn,
					key: keyValue,
					value: keyValue,
					children: [],
				})

				// 目标点（边）
				for (let otherItem of this.state.device_list) {
					if (otherItem !== item) {
						const otherIndex = treeData[index].children.findIndex(
							(element) => sn === element.title,
						)
						const otherSn = otherItem.sn
						const otherKeyValue = `${keyValue}-${otherSn}`
						treeData[index].children[otherIndex].children.push({
							title: `${sn}->${otherSn}`,
							key: otherKeyValue,
							value: otherKeyValue,
						})
					}
				}
			}

			// console.log(treeData)
			return treeData
		}
		return null
	}

	render() {
		return (
			<div className={styles.container}>
				<Row>
					{/* 粘性定位仅限这个 Row 内 */}
					<Col
						xs={0}
						md={8}
						style={{
							position: 'sticky',
							top: 0,
							zIndex: 10,
						}}
					>
						{/* 这个是大屏专用，一直 open 的 */}
						<SideSelect
							isLargeScreen={this.isLargeScreen}
							treeData={this.treeData}
							changeSelection={this.changeSelection}
							selection={this.state.selection}
						/>
					</Col>
					<Col
						xs={24}
						md={0}
						style={{
							position: 'sticky',
							top: 0,
							zIndex: 10,
						}}
					>
						{/* 这个是小屏专用 */}
						<SideSelect
							treeData={this.treeData}
							changeSelection={this.changeSelection}
							selection={this.state.selection}
						/>
					</Col>
					<Col xs={24} md={16} className={styles.division}>
						{/* TODO: 根据用户选择的点渲染图像 */}
						<GLChart
							treeData={this.treeData}
							measure_data_list={this.state.measure_data_list}
							selection={this.state.selection}
						/>
					</Col>
				</Row>
				<Row>
					<Col xs={24} md={6} className={styles.division}>
						<LineChart
							dataList={this.state.d_list}
							timeList={this.state.time_list}
							title={`距离变化(单位: 米)`}
						/>
					</Col>
					<Col xs={24} md={6} className={styles.division}>
						<LineChart
							dataList={this.state.x_list}
							timeList={this.state.time_list}
							title={`x轴相对位置变化(单位: 米)`}
						/>
					</Col>
					<Col xs={24} md={6} className={styles.division}>
						<LineChart
							dataList={this.state.y_list}
							timeList={this.state.time_list}
							title={`y轴相对位置变化(单位: 米)`}
						/>
					</Col>
					<Col xs={24} md={6} className={styles.division}>
						<LineChart
							dataList={this.state.z_list}
							timeList={this.state.time_list}
							title={`z轴相对位置变化(单位: 米)`}
						/>
					</Col>
				</Row>
			</div>
		)
	}
}
