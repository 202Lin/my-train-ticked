
import {
    createStore,
    combineReducers,
    applyMiddleware
} from 'redux'

import reducers from './reducers'
import thunk from 'redux-thunk'

import {h0} from '../common/fp'
import {ORDER_DEPART} from './constant.js'

export default createStore(
    combineReducers(reducers),
    {
        from: null,//出发城市
        to: null,//到大城市
        departDate: h0(Date.now()),//出发日期
        highSpeed: false,//是否是高铁动车
        trainList: [],//列表
        orderType: ORDER_DEPART,
        onlyTickets: false,
        ticketTypes: [],//座椅类型
        checkedTicketTypes: {},//选中的座椅类型
        trainTypes: [],//车次类型
        checkedTrainTypes: {},//选中的车次类型
        departStations: [],//出发车站
        checkedDepartStations: {},
        arriveStations: [],//到达车站
        checkedArriveStations: {},
        departTimeStart: 0,//出发时间起始点
        departTimeEnd: 24,//出发时间截至
        arriveTimeStart: 0,//到达时间起始点
        arriveTimeEnd: 24,
        isFiltersVisible: false,//控制浮层的
        searchParsed: false,
    },
    applyMiddleware(thunk)
)