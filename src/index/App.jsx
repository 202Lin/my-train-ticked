import React,{useCallback,useMemo} from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux';
import './App.css'

import Header from '../common/Header.jsx'
import DepartDate from './DapartDate.jsx'
import HightSpeed from './HighSpeed.jsx'
import Journey from './Journey.jsx'
import Submit from './Submit.jsx'

import CitySelector from '../common/CitySelector.jsx'
import DateSelector from '../common/DateSelector.jsx'

import {h0} from '../common/fp'

import {
    exchangeFromTo,
    showCitySelector,
    hideCitySelector,//关闭城市选择浮层的action
    showDateSelector,//打开日期选择浮层
    fetchCityData,
    setSelectedCity,
    hideDateSelector,
    setDepartDate,
    toggleHighSpeed,
} from './actions'

function App(props) {
    const {
        from,
        to,
        isCitySelectorVisible,
        isDateSelectorVisible,
        cityData,
        isLoadingCityData,
        dispatch, 
        departDate,
        highSpeed   
    } = props
    const onBack = useCallback(() => {
        window.history.back()//去了解一下几种后退的方法
    },[])
    const cbs = useMemo(() => {//看起来小别扭，redux没有为hooks中心化，现在不知道有没？
        return bindActionCreators(
            {
                exchangeFromTo,//在之前的todolist 的demo里面推导过他
                showCitySelector,
            },
            dispatch
        );
    }, []);

    const citySelectorCbs = useMemo(() => {//给城市选择列表返回的方法
        return bindActionCreators(
            {
                onBack: hideCitySelector,
                fetchCityData:fetchCityData,
                onSelect:setSelectedCity
            },
            dispatch
        );
    }, []);

    const departDateCbs = useMemo(() => {//将action和diapatch绑定在一起
        return bindActionCreators({
            onClick:showDateSelector,
            
        },dispatch)
    }, [])

    const dateSelectorCbs = useMemo(() => {//隐藏日期选择浮层
        return bindActionCreators(
            {
                onBack: hideDateSelector,
            },
            dispatch
        );
    }, []);

    const highSpeedCbs = useMemo(() => {//是否选择只高铁动车
        return bindActionCreators(
            {
                toggle: toggleHighSpeed,
            },
            dispatch
        );
    }, []);

    const onSelectDate = useCallback(day => {//点击日期
        if (!day) {
            return;
        }

        if (day < h0()) {
            return;
        }

        dispatch(setDepartDate(day));//将点击的日期回填
        dispatch(hideDateSelector());//关闭日期选择浮层
    }, []);

    return (<div> 
        <div className="header-wrapper">
            {/* 这里Header组件样式需要在顶部，为了组件的通用化，不直接确定他的位置，给他包一层div,给div设置位置 */}
            <Header title="火车票" onBack={onBack}/>
        </div>
        <form className="form" action="./query.html">
            {/* from表单默认使用get方法，会提交input和select的值，所以需要提交的数据都是使用input标签的 */}
            <Journey from={from} to={to} {...cbs} />
            <DepartDate time={departDate} {...departDateCbs}/>
            <HightSpeed 
              {...highSpeedCbs}
              highSpeed={highSpeed}
            />
            <Submit/>
        </form>
        <CitySelector
        // 选择城市列表，有点好奇，怎么会点击就会出现这个呢？
        show={isCitySelectorVisible}
        cityData={cityData}
        isLoading={isLoadingCityData}
        {...citySelectorCbs}
        />
        <DateSelector
        show={isDateSelectorVisible}
        {...dateSelectorCbs}
        onSelect={onSelectDate}
        />
    </div>)
}

export default connect(
    function mapStateToProps(state){
        return state//先将所有的state传入过来
    },
    function mapDispatchToProps(dispatch) {
        return {dispatch}
    }
)(App)