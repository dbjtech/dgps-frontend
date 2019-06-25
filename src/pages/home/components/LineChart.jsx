import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactEcharts from 'echarts-for-react'

export default class LineChart extends Component {
	static propTypes = {
		// prop: PropTypes
	}

	getOption = () => ({
		xAxis: {
			type: 'category',
			data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		},
		yAxis: {
			type: 'value',
		},
		series: [
			{
				data: [820, 932, 901, 934, 1290, 1330, 1320],
				type: 'line',
			},
		],
	})

	render() {
		return (
			<div>
				<ReactEcharts option={this.getOption()} style={{ width: '100%' }} />
			</div>
		)
	}
}
