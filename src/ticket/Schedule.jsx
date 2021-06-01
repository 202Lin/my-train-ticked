import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import URI from 'urijs';
import dayjs from 'dayjs';
import classnames from 'classnames';
import leftPad from 'left-pad';
import './Schedule.css';
import axios from 'axios';

const ScheduleRow = memo(function ScheduleRow(props) {
    const {
        index,//序号
        station,//车站名
        arriveTime,//到达时间
        departTime,//发车时间
        stay,//停靠时长

        isStartStation,//是否始发站
        isEndStation,//是否终点站
        isDepartStation,//是否行程的出发车站
        isArriveStation,//是否行程的终点站
        beforeDepartStation,//是否出发车站之前
        afterArriveStation,//是否终点站之后
    } = props;
    return (
        <li>
            <div
                className={classnames('icon', {
                    'icon-red': isDepartStation || isArriveStation,
                })}
            >
                {isDepartStation
                    ? '出'
                    : isArriveStation
                    ? '到'
                    : leftPad(index, 2, 0)
                    //不是始发站和终点站就用序号且补零
                }
            </div>
            <div
                className={classnames('row', {//出发车站之前或者终点站之后就变灰
                    grey: beforeDepartStation || afterArriveStation,
                })}
            >
                <span //地点,如果是始末站点就标红
                    className={classnames('station', {
                        red: isArriveStation || isDepartStation,
                    })}
                >
                    {station}
                </span>
                <span //时间 如果是始末站点就标红,终点站就渲染终点站,其他就渲染时间
                    className={classnames('arrtime', {
                        red: isArriveStation,
                    })}
                >
                    {isStartStation ? '始发站' : arriveTime}
                </span>
                <span //发车时间
                    className={classnames('deptime', {
                        red: isDepartStation,
                    })}
                >
                    {isEndStation ? '终到站' : departTime}
                </span>
                <span className="stoptime">
                    {/* 停靠时间 */}
                    {isStartStation || isEndStation ? '-' : stay + '分'}
                </span>
            </div>
        </li>
    );
});

ScheduleRow.propTypes = {};

const Schedule = memo(function Schedule(props) {
    const { date, trainNumber, departStation, arriveStation } = props;

    const [scheduleList, setScheduleList] = useState([]);

    useEffect(() => {
        const url = new URI('/rest/schedule')
            .setSearch('trainNumber', trainNumber)
            .setSearch('departStation', departStation)
            .setSearch('arriveStation', arriveStation)
            .setSearch('date', dayjs(date).format('YYYY-MM-DD'))
            .toString();
        axios.get(url)
            .then(res => {
                let {data} = res
                let departRow;//出发车站
                let arriveRow;//到达车站
                for (let i = 0; i < data.length; ++i) {
                    if (!departRow) {//出发车站没确定
                        if (data[i].station === departStation) {//如果当前车站是出发车站
                            departRow = Object.assign(data[i], {//将四个属性给当前车站,若有相同的,第二个参数会覆盖前面的
                                beforeDepartStation: false,
                                isDepartStation: true,//是出发车站
                                afterArriveStation: false,
                                isArriveStation: false,
                            });
                        } else {//不是出发车站
                            Object.assign(data[i], {
                                beforeDepartStation: true,//在出发车站之前表示
                                isDepartStation: false,
                                afterArriveStation: false,
                                isArriveStation: false,
                            });
                        }
                    } else if (!arriveRow) {//到达车站没确定
                        if (data[i].station === arriveStation) {//当前车站就是终点站
                            arriveRow = Object.assign(data[i], {//把达到车站给确定了
                                beforeDepartStation: false,
                                isDepartStation: false,
                                afterArriveStation: false,
                                isArriveStation: true,//表示是终点站
                            });
                        } else {
                            Object.assign(data[i], {//
                                beforeDepartStation: false,
                                isDepartStation: false,
                                afterArriveStation: false,
                                isArriveStation: false,
                            });
                        }
                    } else {//找到了到达站
                        Object.assign(data[i], {//当前车站在到达站之后
                            beforeDepartStation: false,
                            isDepartStation: false,
                            afterArriveStation: true,
                            isArriveStation: false,
                        });
                    }

                    Object.assign(data[i], {
                        isStartStation: i === 0,//通过下标判断是不是起始站和终点站 
                        isEndStation: i === data.length - 1,
                    });
                }

                setScheduleList(data);

            });
    }, [date, trainNumber, departStation, arriveStation]);

    return (
        <div className="schedule">
            <div className="dialog">
                <h1>列车时刻表</h1>
                <div className="head">
                    <span className="station">车站</span>
                    <span className="deptime">到达</span>
                    <span className="arrtime">发车</span>
                    <span className="stoptime">停留时间</span>
                </div>
                <ul>
                    {scheduleList.map((schedule, index) => {
                        return (
                            <ScheduleRow
                                key={schedule.station}
                                index={index + 1}
                                {...schedule}
                            />
                        );
                    })}
                </ul>
            </div>
        </div>
    );
});

Schedule.propTypes = {
    date: PropTypes.number.isRequired,
    trainNumber: PropTypes.string.isRequired,
    departStation: PropTypes.string.isRequired,
    arriveStation: PropTypes.string.isRequired,
};

export default Schedule;
