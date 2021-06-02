import React, { useCallback, useEffect, useMemo } from 'react';
import URI from 'urijs';
import dayjs from 'dayjs';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../common/Header.jsx';
import Detail from '../common/Detail.jsx';
import Account from './Account.jsx';
import Choose from './Choose.jsx';
import Passengers from './Passengers.jsx';
import Ticket from './Ticket.jsx';
import Menu from './Menu.jsx';

import './App.css';

import {
    setDepartStation,
    setArriveStation,
    setTrainNumber,
    setSeatType,
    setDepartDate,
    setSearchParsed,
    fetchInitial,
    createAdult,
    createChild,
    removePassenger,
    updatePassenger,
    hideMenu,
    showGenderMenu,
    showFollowAdultMenu,
    showTicketTypeMenu,
} from './actions';

function App(props) {
    const {
        trainNumber,
        departStation,
        arriveStation,
        seatType,
        departDate,
        arriveDate,
        departTimeStr,
        arriveTimeStr,
        durationStr,
        price,
        passengers,
        menu,
        isMenuVisible,
        searchParsed,
        dispatch,
    } = props;

    const onBack = useCallback(() => {
        window.history.back();
    }, []);

    useEffect(() => {//解析url参数
        const queries = URI.parseQuery(window.location.search);

        const { trainNumber, dStation, aStation, type, date } = queries;

        dispatch(setDepartStation(dStation));//存储到redux中的store
        dispatch(setArriveStation(aStation));
        dispatch(setTrainNumber(trainNumber));
        dispatch(setSeatType(type));
        dispatch(setDepartDate(dayjs(date).valueOf()));//转换成时间戳
        dispatch(setSearchParsed(true));//表示url参数解析完成
    }, []);

    useEffect(() => {//发起异步请求
        if (!searchParsed) {
            return;
        }

        const url = new URI('/rest/order')//构造url
            .setSearch('dStation', departStation)
            .setSearch('aStation', arriveStation)
            .setSearch('type', seatType)
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .toString();
        dispatch(fetchInitial(url));
    }, [searchParsed, departStation, arriveStation, seatType, departDate]);

    const passengersCbs = useMemo(() => {
        return bindActionCreators(
            {
                createAdult,
                createChild,
                removePassenger,
                updatePassenger,
                showGenderMenu,
                showFollowAdultMenu,
                showTicketTypeMenu,
            },
            dispatch
        );
    }, []);

    const menuCbs = useMemo(() => {
        return bindActionCreators(
            {
                hideMenu,
            },
            dispatch
        );
    }, []);

    const chooseCbs = useMemo(() => {
        return bindActionCreators(
            {
                updatePassenger,
            },
            dispatch
        );
    }, []);

    if (!searchParsed) {//如果url没有解析完成，就什么都不渲染
        return null;
    }

    return (
        <div className="app">
            <div className="header-wrapper">
                <Header title="订单填写" onBack={onBack} />
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
                >
                    {/* Detail组件分会议的时候就需要传自组件进去，即使不需要传，也传一个，这里的话vue的插槽明显做了封装 */}
                    <span //这里是画了一个小小火车头 
                        style={{ display: 'block' }}
                        className="train-icon"
                    ></span>
                </Detail>
            </div>
            <Ticket price={price} type={seatType} />
            <Passengers passengers={passengers} {...passengersCbs} />
            {passengers.length > 0 && (//有乘客信息的时候这个组件才显示
                <Choose passengers={passengers} {...chooseCbs} />
            )}
            <Account length={passengers.length} price={price} />
            <Menu show={isMenuVisible} {...menu} {...menuCbs} />
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
