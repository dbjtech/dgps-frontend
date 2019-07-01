import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TreeSelect } from 'antd'

export default class SideSelect extends Component {
	static propTypes = {
		// placeholder: PropTypes.string,
		isLargeScreen: PropTypes.bool,
		treeData: PropTypes.array,
	}

	state = {
		value: undefined,
		width: 0,
		height: 0,
	}

	componentDidMount() {
		this.updateWindowDimensions()
		window.addEventListener('resize', this.updateWindowDimensions)
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions)
	}

	updateWindowDimensions = () => {
		// 为保证实时响应，做成 state 而不是 props
		this.setState({
			width: window.innerWidth,
			height: window.innerHeight,
		})
	}

	onChange = (value) => {
		console.log(value)
		this.setState({ value })
	}

	// treeData = [
	// 	{
	// 		title: 'Node1',
	// 		value: '0-0',
	// 		key: '0-0',
	// 		children: [
	// 			{
	// 				title: 'Child Node1',
	// 				value: '0-0-1',
	// 				key: '0-0-1',
	// 			},
	// 			{
	// 				title: 'Child Node2',
	// 				value: '0-0-2',
	// 				key: '0-0-2',
	// 			},
	// 		],
	// 	},
	// 	{
	// 		title: 'Node2',
	// 		value: '0-1',
	// 		key: '0-1',
	// 	},
	// ]

	render() {
		const treeSelect = this.props.isLargeScreen ? (
			<TreeSelect
				allowClear
				dropdownStyle={{
					height: 465,
					overflow: 'auto',
					display: this.state.width < 768 ? 'none' : null,
				}}
				placeholder={'结果显示框'}
				searchPlaceholder={'搜索栏'}
				showSearch
				// treeData={this.treeData}
				treeData={this.props.treeData}
				treeDefaultExpandAll
				value={this.state.value}
				onChange={this.onChange}
				style={{ width: '100%' }}
				open={true}
			/>
		) : (
			<TreeSelect
				allowClear
				dropdownStyle={{
					height: 465,
					overflow: 'auto',
				}}
				placeholder={'结果显示框'}
				searchPlaceholder={'搜索栏'}
				showSearch
				// treeData={this.treeData}
				treeData={this.props.treeData}
				treeDefaultExpandAll
				value={this.state.value}
				onChange={this.onChange}
				style={{ width: '100%' }}
			/>
		)

		return <div>{treeSelect}</div>
	}
}
