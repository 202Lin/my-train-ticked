import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import './Detail.css';

function format(d) {//转换时间的格式
    const date = dayjs(d);

    return date.format('MM-DD') + ' ' + date.locale('zh-cn').format('ddd');//后面的就会是星期几这种格式
}

const Detail = memo(function Detail(props) {
    const {
        departDate,
        arriveDate,
        departTimeStr,
        arriveTimeStr,
        trainNumber,
        departStation,
        arriveStation,
        durationStr,
    } = props;

    const departDateStr = useMemo(() => format(departDate), [departDate]);
    const arriveDateStr = useMemo(() => format(arriveDate), [arriveDate]);

    return (
        <div className="detail">
            <div className="content">
                <div className="left">
                    <p className="city">{departStation}</p>
                    <p className="time">{departTimeStr}</p>
                    <p className="date">{departDateStr}</p>
                </div>
                <div className="middle">
                    <p className="train-name">{trainNumber}</p>
                    <p className="train-mid">{props.children}</p>
                    <p className="train-time">耗时{durationStr}</p>
                </div>
                <div className="right">
                    <p className="city">{arriveStation}</p>
                    <p className="time">{arriveTimeStr}</p>
                    <p className="date">{arriveDateStr}</p>
                </div>
            </div>
        </div>
    );
});

Detail.propTypes = {
    //有几个组件里面需要的数据还没请求过来组件就渲染了，
    //这里有个可以根本解决的方法，而不是去掉下面几个isRequired
    //那就是设置一个isloading状态，来跟踪异步网络请求的状态，只有请求成功，再去渲染这些组件
    departDate: PropTypes.number.isRequired,
    arriveDate: PropTypes.number.isRequired,
    departTimeStr: PropTypes.string,
    arriveTimeStr: PropTypes.string,
    trainNumber: PropTypes.string.isRequired,
    departStation: PropTypes.string.isRequired,
    arriveStation: PropTypes.string.isRequired,
    durationStr: PropTypes.string,
};

export default Detail;
