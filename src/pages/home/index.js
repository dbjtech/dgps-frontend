import React, { Component } from 'react'
import { Row, Col } from 'antd'
import axios from 'axios'
import moment from 'moment'
import * as R from 'ramda'
import io from 'socket.io-client'
import { throttle } from 'lodash'

import SideSelect from './components/SideSelect.jsx'
import GLChart from './components/GLChart.jsx'
import LineChart from './components/LineChart.jsx'

import styles from './index.module.css'

const promiseSetState = (that, state) =>
  new Promise((resolve, reject) => {
    that.setState(state, () => resolve())
  })

const fetchData = async (that) => {
  const groupRes = await axios.get(`${that.urlPrefix}/group`)
  const group_list = groupRes.data.group_list
  await promiseSetState(that, { group_list })

  const deviceRes = await axios.get(`${that.urlPrefix}/device`)
  const device_list = deviceRes.data.device_list
  await promiseSetState(that, { device_list })

  // 利用 Ramda 进行数据处理，得到 GL 需要的数据结构
  const groupedDevices = R.groupBy((device) => device.group_name)(device_list)
  const glTree = R.map(
    R.pipe(
      R.map(
        R.pipe(
          R.omit(['group_name']),
          R.invertObj,
        ),
      ),

      R.mergeAll,

      R.map(() => []),
    ),
  )(groupedDevices)
  await promiseSetState(that, { glTree })

  const measureRes = await axios.get(
    `${that.urlPrefix}/measure?start_timestamp=1512115984`,
  )
  const measure_data_list = measureRes.data.measure_data_list.sort(
    (a, b) => a.timestamp - b.timestamp,
  )
  await promiseSetState(that, { measure_data_list })
  console.log(measure_data_list)
  // 读取数据之后默认展示一组先
  const selection = `${group_list[0].name}-${measure_data_list[0].src_device_sn}-${measure_data_list[0].dest_device_sn}`
  that.changeSelection(selection)
  promiseSetState(that, { selection })

  // 在此处只调用一次 getTreeData, 避免反复运算
  that.treeData = that.getTreeData()
}

const formatDate = (timestamp) =>
  moment(timestamp * 1000).format(`YYYY-MM-DD HH:mm:ss`)

const setDefaultTimestamp = (dest_data_list) => {
  console.log(dest_data_list)
  for (let data in dest_data_list) {
    if (data) {
      return formatDate(data.timestamp)
    }
  }
}

export default class Home extends Component {
  // 初始化时计算，否则每次渲染都要重新计算，而且不能放在 Select 组件中，否则同时触发
  isLargeScreen = window.innerWidth > 768

  // 是否为开发模式
  isDebug = false
  // isDebug = true

  urlPrefix = this.isDebug ? '' : 'https://dgps.dbjtech.com'

  socket = io(this.urlPrefix)

  latestDataArray = []

  state = {
    group_list: [],
    device_list: [],
    measure_data_list: [],

    d_list: [],
    x_list: [],
    y_list: [],
    z_list: [],
    time_list: [],

    selection: '',
    glTree: {},
    glData: [['x', 'y', 'z', '取样时间', '设备']],
  }

  // 请求后端数据
  componentDidMount() {
    fetchData(this)

    // socket 相关
    this.socket.on('connect', () => {
      console.log('socket connected')
    })
    const throttledFunc = throttle(() => {
      if (this.latestDataArray.length > 0) {
        // 更新数据，添加一部分数据后删除同样数量的数据
        const measure_data_list = this.state.measure_data_list
        this.latestDataArray.map((item) => measure_data_list.push(item))
        measure_data_list.sort((a, b) => a.timestamp - b.timestamp)
        measure_data_list.splice(0, this.latestDataArray.length)

        // 重置新数据，避免重复处理
        this.latestDataArray = []
        this.setState(measure_data_list, () => {
          this.changeSelection(this.state.selection)
        })
      }
    }, 5000)
    // 要保证所有新数据都被接收
    this.socket.on('event', (data) => {
      this.latestDataArray.push(data)
      throttledFunc()
    })
  }

  // 用于双向绑定选中的点或边
  changeSelection = (selection) => {
    // 避免小屏点击展开时的误触发
    if (!selection) return

    const [groupName, srcPoint, destPoint] = selection.split('-')

    // 选中时含有点信息则处理 GL 数据
    if (srcPoint) {
      // 通过分组、源点信息找到所需终点
      const dest_list = R.pipe(
        R.prop(groupName),
        R.omit([srcPoint]),
        R.keys,
      )(this.state.glTree)

      // 调用 R.find 查找源点到终点的信息
      const dest_data_list = R.map((item) => {
        return R.findLast(
          R.both(
            R.propEq('src_device_sn', srcPoint),
            R.propEq('dest_device_sn', item),
          ),
        )(this.state.measure_data_list)
      })(dest_list)

      const ragularPrecision = (value) => (value < 1e-100 ? 0 : value)

      // 构造 glData 需要的终点信息
      const destDataArray = R.map(
        (item) =>
          item && [
            ragularPrecision(item.x),
            ragularPrecision(item.y),
            ragularPrecision(item.z),
            formatDate(item.timestamp),
            `终点 ${item.dest_device_sn}`,
          ],
      )(dest_data_list)

      // 构造 glData
      const glData = [
        ['x', 'y', 'z', '取样时间', '设备'],
        [0, 0, 0, setDefaultTimestamp(dest_data_list), `源点 ${srcPoint}`],
      ]

      // 由于 R.flatten 是递归型铺平，无法直接用在 glData 中
      R.reduce((acc, cur) => glData.push(cur))(glData)(
        destDataArray.filter((item) => !!item),
      )

      this.setState({ glData, selection })
    }

    // 选中边时，处理折线图数据
    if (destPoint) {
      const src_dest_list = this.state.measure_data_list.filter(
        (item) =>
          item.src_device_sn === srcPoint && item.dest_device_sn === destPoint,
      )

      const d_list = src_dest_list.map((item) => item.d)
      const x_list = src_dest_list.map((item) => item.x)
      const y_list = src_dest_list.map((item) => item.y)
      const z_list = src_dest_list.map((item) => item.z)
      const time_list = src_dest_list.map((item) => formatDate(item.timestamp))
      this.setState({
        d_list,
        x_list,
        y_list,
        z_list,
        time_list,
      })

      // 用于双向绑定，暂时只能选边
      this.setState({ selection })
    }
  }

  getTreeData = () => {
    if (this.state.group_list.length && this.state.device_list.length) {
      const treeData = []
      // 分组
      for (let item of this.state.group_list) {
        const name = item.name
        treeData.push({
          title: name,
          key: name,
          value: name,
          children: [],
        })
      }

      // 源点
      for (let item of this.state.device_list) {
        const index = treeData.findIndex(
          (element) => item.group_name === element.title,
        )
        const sn = item.sn
        const keyValue = `${treeData[index].title}-${sn}`
        treeData[index].children.push({
          title: sn,
          key: keyValue,
          value: keyValue,
          children: [],
        })

        // 目标点（边）
        for (let otherItem of this.state.device_list) {
          if (otherItem !== item) {
            const otherIndex = treeData[index].children.findIndex(
              (element) => sn === element.title,
            )
            const otherSn = otherItem.sn
            const otherKeyValue = `${keyValue}-${otherSn}`
            treeData[index].children[otherIndex].children.push({
              title: `${sn}->${otherSn}`,
              key: otherKeyValue,
              value: otherKeyValue,
            })
          }
        }
      }

      return treeData
    }
    return null
  }

  render() {
    // 由于 this 指针问题，treeData 本应只运算一次的，被迫放在 render 中
    this.treeData = this.getTreeData()

    return (
      <div className={styles.container}>
        <Row>
          {/* 粘性定位仅限这个 Row 内 */}
          <Col xs={0} md={8}>
            {/* 这个是大屏专用，一直 open 的 */}
            <SideSelect
              isLargeScreen={this.isLargeScreen}
              treeData={this.treeData}
              changeSelection={this.changeSelection}
              selection={this.state.selection}
            />
          </Col>
          <Col
            xs={24}
            md={0}
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}
          >
            {/* 这个是小屏专用 */}
            <SideSelect
              treeData={this.treeData}
              changeSelection={this.changeSelection}
              selection={this.state.selection}
            />
          </Col>
          <Col xs={24} md={16} className={styles.division}>
            <GLChart
              glData={this.state.glData}
              selection={this.state.selection}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24} md={12} xl={6} className={styles.division}>
            <LineChart
              dataList={this.state.d_list}
              timeList={this.state.time_list}
              title={`距离变化(单位: 米)`}
            />
          </Col>
          <Col xs={24} md={12} xl={6} className={styles.division}>
            <LineChart
              dataList={this.state.x_list}
              timeList={this.state.time_list}
              title={`x轴相对位置变化(单位: 米)`}
            />
          </Col>
          <Col xs={24} md={12} xl={6} className={styles.division}>
            <LineChart
              dataList={this.state.y_list}
              timeList={this.state.time_list}
              title={`y轴相对位置变化(单位: 米)`}
            />
          </Col>
          <Col xs={24} md={12} xl={6} className={styles.division}>
            <LineChart
              dataList={this.state.z_list}
              timeList={this.state.time_list}
              title={`z轴相对位置变化(单位: 米)`}
            />
          </Col>
        </Row>
      </div>
    )
  }
}
