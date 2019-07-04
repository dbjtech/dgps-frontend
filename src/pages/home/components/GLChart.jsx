import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactEcharts from 'echarts-for-react'
import 'echarts-gl'

export default class GLChart extends Component {
	static propTypes = {
		treeData: PropTypes.array,
		measure_data_list: PropTypes.array,
		selection: PropTypes.string,
	}

	state = { value: null }

	componentDidUpdate(prevProps, prevState) {
		if (this.props.selection !== prevProps.selection) {
			this.setState({
				value: this.props.selection,
			})
		}
	}

	EventsDict = {}

	// 取得测量数据中，最新且设备最全的子集
	getLatestData = () => {
		const dataList = this.props.measure_data_list
		if (dataList.length) {
			// const data = []
			const sqrtLength = Math.sqrt(dataList.length)
			const matrix = []
			let timestamp = 0
			let groupIndex = -1
			// 取出一部分最新数据，以便筛选，默认最新在前
			for (let i = 0; i < sqrtLength; i += 1) {
				if (dataList[i].timestamp !== timestamp) {
					timestamp = dataList[i].timestamp
					groupIndex += 1
					matrix[groupIndex] = []
				}
				matrix[groupIndex].push(dataList[i])
			}

			let maxLengthIndex = 0
			let maxLength = matrix[maxLengthIndex].length
			// 根据集合大小找出最大子集
			for (let i = 1; i < matrix.length; i += 1) {
				if (matrix[i].length > maxLength) {
					maxLength = matrix[i].length
					maxLengthIndex = i
				}
			}
			const data = matrix[maxLengthIndex]

			// console.log(data)

			return data
		}
		return null
	}

	// TODO: 吴老师：不要刻意凑成需要的数据，利用 remda 处理出必要的数据就行了
	regularizeData = (sourceData) => {
		const treeData = this.props.treeData
		if (treeData.length) {
		}
		return null
	}

	getOption = () => ({
		grid3D: {
			viewControl: {
				projection: 'orthographic',
			},
		},
		xAxis3D: {
			type: 'value',
		},
		yAxis3D: {
			type: 'value',
		},
		zAxis3D: {
			type: 'value',
		},
		series: [
			// {
			// 	type: 'line3D',
			// 	data: this.getData(),
			// 	lineStyle: {
			// 		width: 3,
			// 	},
			// },
			{
				type: 'scatter3D',
				symbolSize: 12,
				encode: {
					// 此处调整要展示的信息
					tooltip: [0, 1, 2, 3, 4],
				},
			},
		],
		// 悬浮信息显示器
		tooltip: {},
		backgroundColor: '#fff',
		visualMap: {
			show: false,
			dimension: 2,
			min: 0,
			max: 10,
			inRange: {
				color: [
					'#313695',
					'#4575b4',
					'#74add1',
					'#abd9e9',
					'#e0f3f8',
					'#ffffbf',
					'#fee090',
					'#fdae61',
					'#f46d43',
					'#d73027',
					'#a50026',
				],
			},
		},
		dataset: {
			// FIXME: 为了上线直接写死
			dimensions: ['x', 'y', 'z', '取样时间', '设备'],
			source: [
				['x', 'y', 'z', '取样时间', '设备'],
				[0, 0, 0, '2018-01-26 14:41:32', '源点 test02'],
				// x: 1.6217125308407137
				// y: 0.568884563328475
				// z: 0.020524667516560346
				[
					1.6217125308407137,
					0.568884563328475,
					0.020524667516560346,
					'2018-01-26 14:41:32',
					'终点 test03',
				],
				// x: 1.0287799663694828
				// y: 0.4023813328955168
				// z: -2.6467920582981828
				[
					1.0287799663694828,
					0.4023813328955168,
					-2.6467920582981828,
					'2018-01-26 14:41:32',
					'终点 test01',
				],
			],
			// source: this.data,
		},
	})

	render() {
		// console.log(this.props.measure_data_list)
		// console.log(this.getLatestData())

		return (
			<div>
				<ReactEcharts
					option={this.getOption()}
					style={{
						width: '100%',
						height: '500px',
					}}
				/>
			</div>
		)
	}
}
