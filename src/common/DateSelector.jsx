import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import {h0} from '../common/fp.js'
import Header from './Header.jsx';

import './DateSelector.css';


function Day(props) {
    const { day, onSelect } = props;

    if (!day) {//day经过补齐操作，内容很可能为空，判断一下，格外渲染
        return <td className="null"></td>;
    }

    const classes = [];//存储所有的class

    const now = h0();//h0函数默认是当前时间

    if (day < now) {//如果时间是过去的时间
        classes.push('disabled');
    }

    if ([6, 0].includes(new Date(day).getDay())) {//如果时间是周末
        classes.push('weekend');
    }

    const dateString = now === day ? '今天' : new Date(day).getDate();//getDate()返回月份的某一天：

    return (
        <td className={classnames(classes)} onClick={() => onSelect(day)}>
            {/* 使用classnames动态加载类 */}
            {dateString}
        </td>
    );
}


Day.prototype = {
    day:PropTypes.number,
    onSelect:PropTypes.func.isRequired
}

function Week(props) {//周组件
    const { days, onSelect } = props;

    return (
        <tr className="date-table-days">
            {days.map((day, idx) => {
                return <Day key={idx} day={day} onSelect={onSelect} />;
            })}
        </tr>
    );
}

function Month(props) {//月组件
    
    const { startingTimeInMonth,onSelect } = props;

    const startDay = new Date(startingTimeInMonth);//一个月最开始的时间
    const currentDay = new Date(startingTimeInMonth);//可以理解为一个时间指针

    let days = [];//数组用于存放一个月的天数，因为每个月的天数是不一样的嘛！

    while (currentDay.getMonth() === startDay.getMonth()) {//如果月份一样便一直循环，直到月份增加
        days.push(currentDay.getTime());//getTime() 方法可返回距 1970 年 1 月 1 日之间的毫秒数，就是时间戳嘛
        currentDay.setDate(currentDay.getDate() + 1);//setDate() 方法用于设置一个月的某一天。递增加1
    }

    days = new Array(startDay.getDay() ? startDay.getDay() - 1 : 6)//每个月的第一天不一定是星期一
        .fill(null)//用null填
        .concat(days);//判断是星期几，星期天-星期六返回0~6，所以是出了星期天是前面6个空格外，其他都是数字减一个空格
        //然后与days数组连接起来

    const lastDay = new Date(days[days.length - 1]);//嗷嗷，数组下表从零开始，长度比最后一个小标大一，拿到最后一个，就得减一了，咋一下子脑袋没转过来呢


    days = days.concat(
        new Array(lastDay.getDay() ? 7 - lastDay.getDay() : 0).fill(null)
    );

    const weeks = [];

    for (let row = 0; row < days.length / 7; ++row) {
        const week = days.slice(row * 7, (row + 1) * 7);
        weeks.push(week);//数组的内容依然是数组，二维数组了
    }

    return (
        <table className="date-table">
            <thead>
                <tr>
                    <td colSpan="7">
                        <h5>
                            {startDay.getFullYear()}年{startDay.getMonth() + 1}
                            月
                        </h5>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr className="data-table-weeks">
                    <th>周一</th>
                    <th>周二</th>
                    <th>周三</th>
                    <th>周四</th>
                    <th>周五</th>
                    <th className="weekend">周六</th>
                    <th className="weekend">周日</th>
                </tr>
                {
                    weeks.map((week,index) => {//将weeks数组里边的数组给Week组件
                        return (
                            <Week
                            key={index}
                            days={week}
                            onSelect={onSelect}
                            />
                        )
                    })
                }
            </tbody>
        </table>
    );
}
Month.propTypes = {
    startingTimeInMonth: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default function DateSelector(props) {
    const { show, onSelect, onBack } = props;

    const now = new Date();//获取当前时间
    now.setHours(0);//将小时，分钟，秒等后面的精度去掉
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    now.setDate(1);//将天置为每月的第一天

    const monthSequence = [now.getTime()];//用一个数组来保存每个月份的第一天

    now.setMonth(now.getMonth() + 1);//当前月份加一
    monthSequence.push(now.getTime());//将它push到数组里边

    now.setMonth(now.getMonth() + 1);
    monthSequence.push(now.getTime());


    return (
        <div className={classnames('date-selector',{hidden:!show})}>
            <Header title="日期选择" onBack={onBack}/>
            <div className="date-selector-tables">
                {
                    monthSequence.map(month => {//遍历每月的第一天
                        return (
                            <Month
                            key={month}
                            onSelect={onSelect}
                            startingTimeInMonth={month}//每月开始的第一天
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}

DateSelector.propTypes = {
    show: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
};