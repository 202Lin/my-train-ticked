import React, { memo, useState, useCallback, useContext, useMemo } from 'react';
import URI from 'urijs';
import dayjs from 'dayjs';
import { TrainContext } from './context';
import PropTypes from 'prop-types';
import './Candidate.css';

const Channel = memo(function Channel(props) {//渠道
    const { name, desc, type } = props;

    const {
        trainNumber,
        departStation,
        arriveStation,
        departDate,
    } = useContext(TrainContext);//使用了context

    const src = useMemo(() => {
        return new URI('order.html')
            .setSearch('trainNumber', trainNumber)
            .setSearch('dStation', departStation)
            .setSearch('aStation', arriveStation)
            .setSearch('type', type)
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .toString();
    }, [type, trainNumber, departStation, arriveStation, departDate]);

    return (
        <div className="channel">
            <div className="middle">
                <div className="name">{name}</div>
                <div className="desc">{desc}</div>
            </div>
            <a href={src} className="buy-wrapper">
                <div className="buy">买票</div>
            </a>
        </div>
    );
});

Channel.propTypes = {
    name: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

const Seat = memo(function Seat(props) {//座次组件
    const {
        type,
        priceMsg,
        ticketsLeft,
        channels,
        expanded,
        onToggle,
        idx,
    } = props;

    return (
        <li>
            <div className="bar" onClick={() => onToggle(idx)}>
                <span className="seat">{type}</span>
                <span className="price">
                    <i>￥</i>
                    {priceMsg}
                </span>
                <span className="btn">{expanded ? '预订' : '收起'}</span>
                {/* 没点开的时候文案是预定,点开了文案是收起 */}
                <span className="num">{ticketsLeft}</span>
            </div>
            <div
                className="channels"
                style={{ height: expanded ? channels.length * 55 + 'px' : 0 }}
                //通过expanded这个布尔值来控制是否显示,但是我小疑惑,为啥一开始是隐藏的,是准备好的演示就是这样写的吗
            >
                {channels.map(channel => {//内层的遍历
                    return (
                        <Channel key={channel.name} {...channel} type={type} />
                    );
                })}
            </div>
        </li>
    );
});

Seat.propTypes = {
    type: PropTypes.string.isRequired,
    priceMsg: PropTypes.string.isRequired,
    ticketsLeft: PropTypes.string.isRequired,
    channels: PropTypes.array.isRequired,
    expanded: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    idx: PropTypes.number.isRequired,
};

const Candidate = memo(function Candidate(props) {
    const { tickets } = props;

    const [expandedIndex, setExpandedIndex] = useState(-1);
    //标记哪个Seat组件的Channel是展开状态

    const onToggle = useCallback(
        idx => {//当前序号等于展开序号的话就是收起,返回-1,不等于就要展开
            setExpandedIndex(idx === expandedIndex ? -1 : idx);
        },
        [expandedIndex]
    );

    return (
        <div className="candidate">
            <ul>
                {tickets.map((ticket, idx) => {//第一层遍历
                    return (
                        <Seat
                            idx={idx}
                            onToggle={onToggle}
                            expanded={expandedIndex === idx}//展开序号等于当前序号就是展开,就等于展开状态
                            {...ticket}
                            key={ticket.type}
                        />
                    );
                })}
            </ul>
        </div>
    );
});

Candidate.propTypes = {
    tickets: PropTypes.array.isRequired,
};

export default Candidate;
