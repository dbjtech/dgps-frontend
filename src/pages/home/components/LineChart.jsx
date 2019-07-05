import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactEcharts from 'echarts-for-react'
// import echarts from 'echarts'

export default class LineChart extends Component {
	static propTypes = {
		dataList: PropTypes.array,
		timeList: PropTypes.array,
		title: PropTypes.string,
	}

	state = {
		dataList: [],
		timeList: [],
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			this.props.dataList !== prevState.dataList &&
			this.props.timeList !== prevState.timeList
		) {
			this.setState(
				{
					dataList: this.props.dataList,
					timeList: this.props.timeList,
				},
				() => {
					const echarts_instance = this.echarts_react.getEchartsInstance()
					echarts_instance.clear()
					echarts_instance.setOption(this.getOption())
				},
			)
		}
	}

	getOption = () => ({
		title: {
			text: this.props.title,
		},
		xAxis: {
			type: 'category',
			// boundaryGap: false,
			data: this.state.timeList,
		},
		yAxis: {
			type: 'value',
			boundaryGap: [0, '100%'],
		},
		dataZoom: [
			{
				type: 'inside',
				start: 0,
				end: 100,
			},
			{
				start: 0,
				end: 100,
				handleIcon:
					'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
				handleSize: '80%',
				handleStyle: {
					color: '#fff',
					shadowBlur: 3,
					shadowColor: 'rgba(0, 0, 0, 0.6)',
					shadowOffsetX: 2,
					shadowOffsetY: 2,
				},
			},
			{
				type: 'slider',
				yAxisIndex: 0,
				filterMode: 'empty',
			},
		],
		tooltip: {
			trigger: 'axis',
			position: function(pt) {
				return [pt[0], '10%']
			},
		},
		toolbox: {
			feature: {
				// dataZoom: {
				// 	yAxisIndex: 'none',
				// },
				restore: {},
				saveAsImage: {},
			},
		},
		series: [
			{
				name: '测量数据',
				type: 'line',
				smooth: true,
				symbol: 'none',
				sampling: 'average',
				itemStyle: {
					color: 'rgb(255, 70, 131)',
				},
				lineStyle: {
					// 重新渲染的是线的样式
					width: 1,
				},
				areaStyle: {
					color: 'rgb(255, 70, 131)',
				},
				data: this.state.dataList,
			},
		],
	})

	render() {
		// console.log('line chart render')
		return (
			<div>
				<ReactEcharts
					option={this.getOption()}
					style={{ width: '100%' }}
					ref={(e) => {
						this.echarts_react = e
					}}
				/>
			</div>
		)
	}
}
