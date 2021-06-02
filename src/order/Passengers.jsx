import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import './Passengers.css';

const Passenger = memo(function Passenger(props) {
    const {
        id,
        name,
        followAdultName,//儿童的同行成人
        ticketType,//
        licenceNo,//身份证号
        gender,//性别
        birthday,//生日
        onRemove,//移出乘客信息
        onUpdate,
        showGenderMenu,//性别图层
        showFollowAdultMenu,
        showTicketTypeMenu,
    } = props;

    const isAdult = ticketType === 'adult';//判断是否是成人乘客

    return (
        <li className="passenger">
            <i className="delete" onClick={() => onRemove(id)}>
                {/*  删除乘客*/}
                —
            </i>
            <ol className="items">
                <li className="item">
                    <label className="label name">姓名</label>
                    <input
                        type="text"
                        className="input name"
                        placeholder="乘客姓名"
                        value={name}
                        onChange={e => onUpdate(id, { name: e.target.value })}
                    />
                    <label
                        className="ticket-type"
                        onClick={() => showTicketTypeMenu(id)}//根据点击不同渲染
                    >
                        {isAdult ? '成人票' : '儿童票'}
                    </label>
                </li>
                {isAdult && (//成人乘客才渲染，所以判断一下
                    <li className="item">
                        <label className="label licenceNo">身份证</label>
                        <input
                            type="text"
                            className="input licenceNo"
                            placeholder="证件号码"
                            value={licenceNo}
                            onChange={e =>
                                onUpdate(id, { licenceNo: e.target.value })
                            }
                        />
                    </li>
                )}
                {!isAdult && (//儿童乘客才显示性别
                    <li className="item arrow">
                        <label className="label gender">性别</label>
                        <input
                            type="text"
                            className="input gender"
                            placeholder="请选择"
                            onClick={() => showGenderMenu(id)}//点击弹出选择菜单
                            value={
                                gender === 'male'
                                    ? '男'
                                    : gender === 'female'
                                    ? '女'
                                    : ''
                            }
                            readOnly
                        />
                    </li>
                )}
                {!isAdult && (//儿童乘客才显示的出生日期 
                    <li className="item">
                        <label className="label birthday">出生日期</label>
                        <input
                            type="text"
                            className="input birthday"
                            placeholder="如 19951015"
                            value={birthday}
                            onChange={e =>
                                onUpdate(id, { birthday: e.target.value })
                            }
                        />
                    </li>
                )}
                {!isAdult && (//儿童需要填写的同行成人
                    <li className="item arrow">
                        <label className="label followAdult">同行成人</label>
                        <input
                            type="text"
                            className="input followAdult"
                            placeholder="请选择"
                            value={followAdultName}
                            onClick={() => showFollowAdultMenu(id)}
                            readOnly
                        />
                    </li>
                )}
            </ol>
        </li>
    );
});

Passenger.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    followAdult: PropTypes.number,
    followAdultName: PropTypes.string,
    ticketType: PropTypes.string.isRequired,
    licenceNo: PropTypes.string,
    gender: PropTypes.string,
    birthday: PropTypes.string,
    onRemove: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    showGenderMenu: PropTypes.func.isRequired,
    showFollowAdultMenu: PropTypes.func.isRequired,
    showTicketTypeMenu: PropTypes.func.isRequired,
};

const Passengers = memo(function Passengers(props) {
    const {
        passengers,//数组
        createAdult,//增加成人乘客
        createChild,//增加儿童乘客
        removePassenger,
        updatePassenger,
        showGenderMenu,
        showFollowAdultMenu,
        showTicketTypeMenu,
    } = props;

    const nameMap = useMemo(() => {//id到name的映射
        const ret = {};

        for (const passenger of passengers) {
            ret[passenger.id] = passenger.name;
        }

        return ret;
    }, [passengers]);

    return (
        <div className="passengers">
            <ul>
                {passengers.map(passenger => {//遍历乘客
                    return (
                        <Passenger
                            {...passenger}
                            followAdultName={nameMap[passenger.followAdult]}
                            showTicketTypeMenu={showTicketTypeMenu}
                            showGenderMenu={showGenderMenu}
                            showFollowAdultMenu={showFollowAdultMenu}
                            onRemove={removePassenger}
                            onUpdate={updatePassenger}
                            key={passenger.id}
                        />
                    );
                })}
            </ul>
            {/* 两个按钮 */}
            <section className="add">
                <div className="adult" onClick={() => createAdult()}>
                    添加成人
                </div>
                <div className="child" onClick={() => createChild()}>
                    添加儿童
                </div>
            </section>
        </div>
    );
});

Passengers.propTypes = {
    passengers: PropTypes.array.isRequired,
    createAdult: PropTypes.func.isRequired,
    createChild: PropTypes.func.isRequired,
    showGenderMenu: PropTypes.func.isRequired,
    showFollowAdultMenu: PropTypes.func.isRequired,
    showTicketTypeMenu: PropTypes.func.isRequired,
};

export default Passengers;
