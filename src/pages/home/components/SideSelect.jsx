import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TreeSelect } from 'antd'
import { debounce } from 'lodash'

export default class SideSelect extends Component {
	static propTypes = {
		isLargeScreen: PropTypes.bool,
		treeData: PropTypes.array,
		changeSelection: PropTypes.func,
		selection: PropTypes.string,
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.selection !== prevProps.selection) {
			this.setState({ value: this.props.selection })
		}
	}

	state = {
		value: null,
		width: 0,
	}

	componentDidMount() {
		this.updateWindowDimensions()
		window.addEventListener('resize', this.updateWindowDimensions)
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions)
	}

	updateWindowDimensions = debounce(() => {
		// 为保证实时响应，做成 state 而不是 props
		this.setState({
			width: window.innerWidth,
		})
	}, 1000)

	handleChange = (value) => {
		this.props.changeSelection(value)
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
