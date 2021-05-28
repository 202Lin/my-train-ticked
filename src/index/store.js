import {
    createStore,//创建store
    combineReducers,//将多个reducers联合起来
    applyMiddleware//中间件
} from 'redux'

import reducers from './reducers'
import thunk from 'redux-thunk'

export default createStore(
    combineReducers(reducers),//在reducers.js中暴露了多个reducer
    {//第二个参数就是初始state
        from: '北京',
        to: '上海',
        isCitySelectorVisible: false,//城市列表是否选择，页面切换是通过Z-index图层的，所用使用该布尔值控制动态类，进而控制图层
        currentSelectingLeftCity: false,
        cityData: null,
        isLoadingCityData: false,
        isDateSelectorVisible: false,
        departDate: Date.now(),
        highSpeed: false,
    },
    applyMiddleware(thunk)//使用中间件thunk,使得dispatch(),能够接收一个函数作为参数
)