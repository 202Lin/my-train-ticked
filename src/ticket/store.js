import {
    createStore,
    combineReducers,
    applyMiddleware
} from 'redux'

import reducers from './reducers'
import thunk from 'redux-thunk'

export default createStore(
    combineReducers(reducers),
    {
        departDate: Date.now(),//出发日期
        arriveDate: Date.now(),//抵达日期，从服务端的数据接口中获取
        departTimeStr: null,//字符串形式
        arriveTimeStr: null,
        departStation: null,//出发车站
        arriveStation: null,
        trainNumber: null,//车号
        durationStr: null,//运行时间。从数据接口获取
        tickets: [],//出票渠道，来源于数据接口
        isScheduleVisible: false,//控制图层
        searchParsed: false,//表示url是否解析完成
    },
    applyMiddleware(thunk)
)