import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'

const { Option } = Select

export default class SideSelect extends Component {
	static propTypes = {
		// prop: PropTypes,
	}

	onChange = (value) => {
		console.log(`selected ${value}`)
	}

	onSearch = (val) => {
		console.log('search:', val)
	}

	render() {
		return (
			<div>
				<Select
					showSearch
					style={{ width: '100%' }}
					placeholder='Select a person'
					optionFilterProp='children'
					onChange={this.onChange}
					onSearch={this.onSearch}
					filterOption={(input, option) =>
						option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
						0
					}>
					<Option value='jack'>Jack</Option>
					<Option value='lucy'>Lucy</Option>
					<Option value='tom'>Tom</Option>
				</Select>
			</div>
		)
	}
}
