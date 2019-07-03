import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactEcharts from 'echarts-for-react'
import 'echarts-gl'

export default class GLChart extends Component {
	static propTypes = {
		// prop: PropTypes
	}

	EventsDict = {}

	getData = () => {
		var data = []
		// Parametric curve
		for (var t = 0; t < 25; t += 0.001) {
			var x = (1 + 0.25 * Math.cos(75 * t)) * Math.cos(t)
			var y = (1 + 0.25 * Math.cos(75 * t)) * Math.sin(t)
			var z = t + 2.0 * Math.sin(75 * t)
			data.push([x, y, z])
		}
		// console.log(data)
		return data
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
			{
				type: 'line3D',
				data: this.getData(),
				lineStyle: {
					width: 3,
				},
			},
		],
		tooltip: {},
		backgroundColor: '#fff',
		visualMap: {
			show: false,
			dimension: 2,
			min: 0,
			max: 30,
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
		dataset: { dimensions: ['d', 'x', 'y', 'z'] },
	})

	render() {
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
