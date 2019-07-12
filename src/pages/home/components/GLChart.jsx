import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactEcharts from 'echarts-for-react'
import 'echarts-gl'

export default class GLChart extends Component {
	static propTypes = {
		glData: PropTypes.array,
		selection: PropTypes.string,
	}

	state = {
		// glData: [
		// 	['x', 'y', 'z', '取样时间', '设备'],
		// 	[0, 0, 0, '2018-01-26 14:41:32', '源点 test02'],
		// 	// x: 1.6217125308407137
		// 	// y: 0.568884563328475
		// 	// z: 0.020524667516560346
		// 	[
		// 		1.6217125308407137,
		// 		0.568884563328475,
		// 		0.020524667516560346,
		// 		'2018-01-26 14:41:32',
		// 		'终点 test03',
		// 	],
		// 	// x: 1.0287799663694828
		// 	// y: 0.4023813328955168
		// 	// z: -2.6467920582981828
		// 	[
		// 		1.0287799663694828,
		// 		0.4023813328955168,
		// 		-2.6467920582981828,
		// 		'2018-01-26 14:41:32',
		// 		'终点 test01',
		// 	],
		// ],
		glData: [],
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.glData !== prevProps.glData) {
			this.setState(
				{
					glData: this.props.glData,
				},
				() => {
					// const echarts_instance = this.echarts_react.getEchartsInstance()
					// echarts_instance.clear()
					// echarts_instance.setOption(this.getOption())
				},
			)
		}
	}

	EventsDict = {}

	getOption = () => {
		// 每条 3D 折线都要单独的数组
		const glData = this.state.glData
		const option = {
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
				{
					type: 'scatter3D',
					symbolSize: 12,
					encode: {
						// 此处调整要展示的信息
						tooltip: [0, 1, 2, 3, 4],
					},
					itemStyle: {
						color: '#40a9ff',
					},
				},
			],
			// 悬浮信息显示器
			tooltip: {},
			toolbox: {
				feature: {
					restore: {},
					saveAsImage: {},
				},
			},
			backgroundColor: '#fff',
			dataset: {
				dimensions: ['x', 'y', 'z', '取样时间', '设备'],
				source: glData,
			},
		}

		const [, , destPoint] = this.props.selection.split('-')
		glData.forEach((item, index) => {
			if (index > 1) {
				let data =
					destPoint && new RegExp(destPoint).test(item[4])
						? {
								type: 'line3D',
								data: [[0, 0, 0], item],
								lineStyle: {
									width: 4,
									// 选中颜色
									color: '#36cfc9',
								},
						  }
						: {
								type: 'line3D',
								data: [[0, 0, 0], item],
								lineStyle: {
									width: 4,
									// 默认颜色
									color: '#40a9ff',
								},
						  }

				option.series.push(data)
			}
		})

		return option
	}

	render() {
		return (
			<div>
				<ReactEcharts
					option={this.getOption()}
					style={{
						width: '100%',
						height: '500px',
					}}
					ref={(e) => {
						this.echarts_react = e
					}}
				/>
			</div>
		)
	}
}
