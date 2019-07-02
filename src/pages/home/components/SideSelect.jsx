import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TreeSelect } from 'antd'

export default class SideSelect extends Component {
	static propTypes = {
		isLargeScreen: PropTypes.bool,
		treeData: PropTypes.array,
		changeSelect: PropTypes.func,
	}

	state = {
		value: null,
		width: 0,
		// height: 0,
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
			// height: window.innerHeight,
		})
	}

	handleChange = (value) => {
		// console.log(value)
		this.props.changeSelect(value)
		this.setState({ value })
	}

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
				onChange={this.handleChange}
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
				onChange={this.handleChange}
				style={{ width: '100%' }}
			/>
		)

		return <div>{treeSelect}</div>
	}
}
