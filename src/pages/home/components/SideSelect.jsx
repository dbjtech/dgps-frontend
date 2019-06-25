import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TreeSelect } from 'antd'

const { TreeNode } = TreeSelect

export default class SideSelect extends Component {
	static propTypes = {
		placeholder: PropTypes.string,
	}

	state = {
		value: undefined,
	}

	onChange = (value) => {
		console.log(value)
		this.setState({ value })
	}

	onSearch = (val) => {
		console.log('search:', val)
	}

	render() {
		return (
			<div>
				<TreeSelect
					showSearch
					style={{ width: '100%' }}
					value={this.state.value}
					dropdownStyle={{
						maxHeight: 400,
						overflow: 'auto',
					}}
					placeholder='Please select'
					allowClear
					treeDefaultExpandAll
					onChange={this.onChange}
					open>
					<TreeNode value='parent 1' title='parent 1' key='0-1'>
						<TreeNode value='parent 1-0' title='parent 1-0' key='0-1-1'>
							<TreeNode value='leaf1' title='my leaf' key='random' />
							<TreeNode value='leaf2' title='your leaf' key='random1' />
						</TreeNode>
						<TreeNode value='parent 1-1' title='parent 1-1' key='random2'>
							<TreeNode
								value='sss'
								title={<b style={{ color: '#08c' }}>sss</b>}
								key='random3'
							/>
						</TreeNode>
					</TreeNode>
				</TreeSelect>
			</div>
		)
	}
}
