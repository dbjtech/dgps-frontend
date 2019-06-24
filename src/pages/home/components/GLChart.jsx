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
		function makeGaussian(amplitude, x0, y0, sigmaX, sigmaY) {
			return function(amplitude, x0, y0, sigmaX, sigmaY, x, y) {
				var exponent = -(
					Math.pow(x - x0, 2) / (2 * Math.pow(sigmaX, 2)) +
					Math.pow(y - y0, 2) / (2 * Math.pow(sigmaY, 2))
				)
				return amplitude * Math.pow(Math.E, exponent)
			}.bind(null, amplitude, x0, y0, sigmaX, sigmaY)
		}
		// 创建一个高斯分布函数
		var gaussian = makeGaussian(50, 0, 0, 20, 20)

		var data = []
		for (var i = 0; i < 1000; i++) {
			// x, y 随机分布
			var x = Math.random() * 100 - 50
			var y = Math.random() * 100 - 50
			var z = gaussian(x, y)
			data.push([x, y, z])
		}
		return data
	}

	getOption = () => ({
		grid3D: {},
		xAxis3D: {},
		yAxis3D: {},
		zAxis3D: {},
		series: [
			// {
			// 	type: 'scatter3D',
			// 	symbolSize: 50,
			// 	data: [[-1, -1, -1], [0, 0, 0], [1, 1, 1]],
			// 	itemStyle: {
			// 		opacity: 1,
			// 	},
			// },
			{
				type: 'scatter3D',
				data: this.getData(),
			},
		],
	})

	render() {
		return (
			<div>
				<ReactEcharts
					option={this.getOption()}
					style={{ width: '100%', height: '500px' }}
				/>
			</div>
		)
	}
}
