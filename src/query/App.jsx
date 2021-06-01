import React,{useCallback,useEffect,useMemo} from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux';
import URI from 'urijs'//用于解析url
import dayjs from 'dayjs'
import axios from 'axios'

import {h0} from '../common/fp'
import Header from '../common/Header.jsx'
import Nav from '../common/Nav'
import List from './List'
import Bottom from './Bottom'
import useNav from '../common/useNav';

import {
    setFrom,
    setTo,
    setDepartDate,
    setHighSpeed,
    setSearchParsed,//设置是否解析完url参数的
    setTrainList,
    setTicketTypes,
    setTrainTypes,
    setDepartStations,
    setArriveStations,
    prevDate,//
    nextDate,//
    toggleOrderType,
    toggleHighSpeed,
    toggleOnlyTickets,
    toggleIsFiltersVisible,

    setCheckedTicketTypes,//座椅车次出发到达车站的选择是数组，是页面开始时异步请求时获取的
    setCheckedTrainTypes,//所以我们只需要讲选中的四个action传给buttom浮层
    setCheckedDepartStations,
    setCheckedArriveStations,
    setDepartTimeStart,//出发时间的起点和终点
    setDepartTimeEnd,
    setArriveTimeStart,//到达时间的起点和终点
    setArriveTimeEnd,
} from './actions.js'

import './App.css'
function App(props) {

    const {
        from,
        to,
        dispatch,//作为管理状态的方法传过来的
        highSpeed,
        searchParsed,//确保url被解析后才发起异步请求
        orderType,
        onlyTickets,
        isFiltersVisible,//决定综合筛选浮层是否显示
        ticketTypes,//buttom浮层座椅类型选择
        trainTypes,//buttom浮层车次类型选择
        departStations,//出发车站
        arriveStations,//到达车站
        checkedTicketTypes,//上边四个是可选项，上边四个的选中的
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd,
        departDate,
        trainList
    } = props

    useEffect(() => {//解析url，应该是这个页面每次渲染的时候就需要发送请求，所以用useEffect包裹
        const queries = URI.parseQuery(window.location.search)//解析url
        //window.location.search是从问号 (?) 开始的 URL（查询部分
        //parseQuery则可以格式化解析这部分内容为一个对象

        const {//解析后的结果
            from,
            to,
            date,
            highSpeed,
        } = queries

        dispatch(setFrom(from));//将from数据写入store
        dispatch(setTo(to));
        dispatch(setDepartDate(h0(dayjs(date).valueOf())));//dayjs.valueOf将时间字符串转换为时间戳，h0去掉小时等精度
        dispatch(setHighSpeed(highSpeed === 'true'));//highSpeed是一个字符串，通过===，转换为布尔值

        dispatch(setSearchParsed(true));//标记url已经解析完成了
    },[])

    useEffect(() => {
        if(!searchParsed) {//如果url还没解析完。
            return
        }

        const url = new URI('/static/query')//构建url
        .setSearch('from', from)//通过链式调用的方式给参数
        .setSearch('to', to)
        .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
        .setSearch('highSpeed', highSpeed)
        .setSearch('orderType', orderType)
        .setSearch('onlyTickets', onlyTickets)
        .setSearch(
            'checkedTicketTypes',
            Object.keys(checkedTicketTypes).join()//取出对象中的key值，转换成字符串
        )
        .setSearch(
            'checkedTrainTypes',
            Object.keys(checkedTrainTypes).join()
        )
        .setSearch(
            'checkedDepartStations',
            Object.keys(checkedDepartStations).join()
        )
        .setSearch(
            'checkedArriveStations',
            Object.keys(checkedArriveStations).join()
        )
        .setSearch('departTimeStart', departTimeStart)
        .setSearch('departTimeEnd', departTimeEnd)
        .setSearch('arriveTimeStart', arriveTimeStart)
        .setSearch('arriveTimeEnd', arriveTimeEnd)
        .toString();//转换为字符串

        axios.get(url)//使用axios发送请求
        .then(res => {
            console.log(res.data)
            const {//结构取值
                dataMap: {
                    directTrainInfo: {
                        trains,
                        filter: {
                            ticketType,
                            trainType,
                            depStation,
                            arrStation,
                        },
                    },
                },
            } = res.data;

            //把取到的值存进store
            dispatch(setTrainList(trains));
            dispatch(setTicketTypes(ticketType));
            dispatch(setTrainTypes(trainType));
            dispatch(setDepartStations(depStation));
            dispatch(setArriveStations(arrStation));
        });
    }, [
        from,
        to,
        dispatch,
        highSpeed,
        searchParsed,
        orderType,
        onlyTickets,
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd,
        departDate])

        const { isPrevDisabled, isNextDisabled, prev, next } = useNav(//自定义hook
            departDate,
            dispatch,
            prevDate,
            nextDate
        );

    const onBack = useCallback(() => {//回退
        window.history.back();
    }, []);

    const bottomCbs = useMemo(() => {//将action和dispatch绑定起来
        return bindActionCreators(
            {
                toggleOrderType,
                toggleHighSpeed,
                toggleOnlyTickets,
                toggleIsFiltersVisible,
                setCheckedTicketTypes,
                setCheckedTrainTypes,
                setCheckedDepartStations,
                setCheckedArriveStations,
                setDepartTimeStart,
                setDepartTimeEnd,
                setArriveTimeStart,
                setArriveTimeEnd,
            },
            dispatch
        );
    }, []);


    if(!searchParsed) {//如果url参数没有获取成功，不需要渲染
        return null
    }




    return (
        <div>
            <div className="header-wrapper">
                <Header
                title={`${from}——>${to}`}
                onBack={onBack}
                />
            </div>
            <Nav 
            date={departDate}
            isPrevDisabled={isPrevDisabled}
            isNextDisabled={isNextDisabled}
            prev={prev}
            next={next}
            />
            <List list={trainList}/>
            <Bottom
                highSpeed={highSpeed}
                orderType={orderType}
                onlyTickets={onlyTickets}
                isFiltersVisible={isFiltersVisible}
                ticketTypes={ticketTypes}
                trainTypes={trainTypes}
                departStations={departStations}
                arriveStations={arriveStations}
                checkedTicketTypes={checkedTicketTypes}
                checkedTrainTypes={checkedTrainTypes}
                checkedDepartStations={checkedDepartStations}
                checkedArriveStations={checkedArriveStations}
                departTimeStart={departTimeStart}
                departTimeEnd={departTimeEnd}
                arriveTimeStart={arriveTimeStart}
                arriveTimeEnd={arriveTimeEnd}
                {...bottomCbs}
            />
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