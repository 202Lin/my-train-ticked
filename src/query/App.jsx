import React,{useCallback,useEffect} from 'react'
import {connect} from 'react-redux'
import URI from 'urijs'
import dayjs from 'dayjs'

import {h0} from '../common/fp'
import Header from '../common/Header.jsx'
import Nav from '../common/Nav'
import List from './List'
import Bottom from './Bottom'

import {
    setFrom,
    setTo,
    setDepartDate,
    setHighSpeed,
} from './actions.js'

import './App.css'
function App(props) {

    const {
        from,
        to,
        dispatch,//作为管理状态的方法传过来的
    } = props

    useEffect(() => {//解析url
        const queries = URI.parseQuery(window.location.search)//解析url

        const {
            from,
            to,
            date,
            highSpeed,
        } = queries

        dispatch(setFrom(from));//将from数据写入store
        dispatch(setTo(to));
        dispatch(setDepartDate(h0(dayjs(date).valueOf())));//dayjs.valueOf将时间字符串转换为时间戳，h0去掉小时等精度
        dispatch(setHighSpeed(highSpeed === 'true'));//highSpeed是一个字符串，通过===，转换为布尔值

    },[])
    const onBack = useCallback(() => {//回退
        window.history.back();
    }, []);

    return (
        <div>
            <div className="header-wrapper">
                <Header
                title={`${from}——>${to}`}
                onBack={onBack}
                />
            </div>
            <Nav/>
            <List/>
            <Bottom/>
        </div>
    )
}

export default connect(
    function mapStateToProps(state){
        return state
    },
    function mapDispatchToProps(dispatch) {
        return {dispatch}
    }
)(App)