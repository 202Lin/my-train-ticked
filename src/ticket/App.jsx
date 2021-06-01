import React, { useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import URI from 'urijs';
import dayjs from 'dayjs';
import axios from 'axios'
import { h0 } from '../common/fp';
import useNav from '../common/useNav';//使用自定义hook函数
import Header from '../common/Header.jsx';
import Nav from '../common/Nav.jsx';
import Detail from '../common/Detail.jsx';
import Candidate from './Candidate.jsx';
import { TrainContext } from './context';
//import Schedule from './Schedule.jsx';通过异步加载的方式请求的话，就不能是这种方式引入
import './App.css';

import {
    setDepartStation,
    setArriveStation,
    setTrainNumber,
    setDepartDate,
    setSearchParsed,
    prevDate,
    nextDate,
    setDepartTimeStr,
    setArriveTimeStr,
    setArriveDate,
    setDurationStr,
    setTickets,
    toggleIsScheduleVisible,
} from './actions';

const Schedule = lazy(() => import('./Schedule.jsx'));//异步引入，Schedule是一个异步组件了

function App(props) {
    const {
        departDate,
        arriveDate,
        departTimeStr,
        arriveTimeStr,
        departStation,
        arriveStation,
        trainNumber,
        durationStr,
        tickets,
        isScheduleVisible,
        searchParsed,

        dispatch,
    } = props;

    const onBack = useCallback(() => {//回退
        window.history.back();
    }, []);

    useEffect(() => {//解析url
        const queries = URI.parseQuery(window.location.search);
        const { aStation, dStation, date, trainNumber } = queries;

        dispatch(setDepartStation(dStation));//将值传入store
        dispatch(setArriveStation(aStation));
        dispatch(setTrainNumber(trainNumber));
        dispatch(setDepartDate(h0(dayjs(date).valueOf())));//转换为时间戳并且去掉小时分钟秒

        dispatch(setSearchParsed(true));//表示url解析完成
    }, []);

    useEffect(() => {//将页面的标题为车次
        document.title = trainNumber;
    }, [trainNumber]);

    useEffect(() => {
        if (!searchParsed) {//如果uri没有解析完成就不要渲染
            return;
        }

        const url = new URI('/rest/ticket')//构建url
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .setSearch('trainNumber', trainNumber)
            .toString();

        axios.get(url)
            .then(res => {
                const { detail, candidates } = res.data;

                const {
                    departTimeStr,
                    arriveTimeStr,
                    arriveDate,
                    durationStr,
                } = detail;

                dispatch(setDepartTimeStr(departTimeStr));//保存获得的数据
                dispatch(setArriveTimeStr(arriveTimeStr));
                dispatch(setArriveDate(arriveDate));
                dispatch(setDurationStr(durationStr));
                dispatch(setTickets(candidates));
            });
    }, [searchParsed, departDate, trainNumber]);

    const { isPrevDisabled, isNextDisabled, prev, next } = useNav(
        departDate,
        dispatch,
        prevDate,
        nextDate
    );

    const detailCbs = useMemo(() => {//action与dispatch绑定在一起
        return bindActionCreators(
            {
                toggleIsScheduleVisible,
            },
            dispatch
        );
    }, []);

    if (!searchParsed) {
        return null;
    }

    return (
        <div className="app">
            <div className="header-wrapper">
                <Header title={trainNumber} onBack={onBack} />
            </div>
            <div className="nav-wrapper">
                <Nav
                    date={departDate}//时间戳
                    isPrevDisabled={isPrevDisabled}//前一天的按钮是否可用
                    isNextDisabled={isNextDisabled}
                    prev={prev}//点击前一天
                    next={next}
                />
            </div>
            <div className="detail-wrapper">
                <Detail
                    departDate={departDate}
                    arriveDate={arriveDate}
                    departTimeStr={departTimeStr}
                    arriveTimeStr={arriveTimeStr}
                    trainNumber={trainNumber}
                    departStation={departStation}
                    arriveStation={arriveStation}
                    durationStr={durationStr}
                    {...detailCbs}
                >
                    <span className="left"></span>
                    <span
                        className="schedule"
                        onClick={() => detailCbs.toggleIsScheduleVisible()}
                    >
                        时刻表
                    </span>
                    <span className="right"></span>
                </Detail>
            </div>
            <TrainContext.Provider
            //这是使用了context,但是小小疑惑,使用了redux,不是谁都可以调用store里面的数据吗?该怎么用?context还有必要吗
                value={{
                    trainNumber,
                    departStation,
                    arriveStation,
                    departDate,
                }}
            >
                <Candidate tickets={tickets} />
            </TrainContext.Provider>
            {isScheduleVisible && (
                <div
                    className="mask"
                    onClick={() => dispatch(toggleIsScheduleVisible())}//点击就关闭？
                >
                    <Suspense fallback={<div>loading</div>}>
                    {/* 使用Suspense包裹 */}
                        <Schedule
                            date={departDate}
                            trainNumber={trainNumber}
                            departStation={departStation}
                            arriveStation={arriveStation}
                        />
                    </Suspense>
                </div>
            )}
        </div>
    );
}

export default connect(
    function mapStateToProps(state) {
        return state;
    },
    function mapDispatchToProps(dispatch) {
        return { dispatch };
    }
)(App);
