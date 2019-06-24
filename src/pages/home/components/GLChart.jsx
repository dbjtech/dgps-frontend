import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactEcharts from 'echarts-for-react'
import 'echarts-gl'

export default class GLChart extends Component {
	static propTypes = {
		// prop: PropTypes
	}

	EventsDict = {}

	getOption = () => ({
		grid3D: {},
		xAxis3D: {},
		yAxis3D: {},
		zAxis3D: {},
		series: [
			{
				type: 'scatter3D',
				symbolSize: 50,
				data: [[-1, -1, -1], [0, 0, 0], [1, 1, 1]],
				itemStyle: {
					opacity: 1,
				},
			},
		],
	})

	render() {
		// let data = []
		// // Parametric curve
		// for (let t = 0; t < 25; t += 0.001) {
		// 	const x = (1 + 0.25 * Math.cos(75 * t)) * Math.cos(t)
		// 	const y = (1 + 0.25 * Math.cos(75 * t)) * Math.sin(t)
		// 	const z = t + 2.0 * Math.sin(75 * t)
		// 	data.push([x, y, z])
		// }
		// console.log(data.length)

		// const option = {
		// 	tooltip: {},
		// 	backgroundColor: '#fff',
		// 	visualMap: {
		// 		show: false,
		// 		dimension: 2,
		// 		min: 0,
		// 		max: 30,
		// 		inRange: {
		// 			color: [
		// 				'#313695',
		// 				'#4575b4',
		// 				'#74add1',
		// 				'#abd9e9',
		// 				'#e0f3f8',
		// 				'#ffffbf',
		// 				'#fee090',
		// 				'#fdae61',
		// 				'#f46d43',
		// 				'#d73027',
		// 				'#a50026',
		// 			],
		// 		},
		// 	},
		// 	xAxis3D: {
		// 		type: 'value',
		// 	},
		// 	yAxis3D: {
		// 		type: 'value',
		// 	},
		// 	zAxis3D: {
		// 		type: 'value',
		// 	},
		// 	grid3D: {
		// 		viewControl: {
		// 			projection: 'orthographic',
		// 		},
		// 	},
		// 	series: [
		// 		{
		// 			type: 'line3D',
		// 			data: data,
		// 			lineStyle: {
		// 				width: 4,
		// 			},
		// 		},
		// 	],
		// }

		return (
			<div>
				{/* <ReactEcharts
					option={option}
					notMerge={true}
					lazyUpdate={true}
					theme={'theme_name'}
					// onChartReady={this.onChartReadyCallback}
					onEvents={this.EventsDict}
					opts={{ renderer: 'svg' }}
				/> */}
				<ReactEcharts option={this.getOption()} />
			</div>
		)
	}
}
