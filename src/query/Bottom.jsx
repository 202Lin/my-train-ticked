//这个组件的精髓是设置一层缓冲区，选择后并不会直接与redux中的数据同步，只有点击确定按钮后才会把数据传过去，这个过程中缓冲区的数据还要随时监听用户的选择
import React, { memo, 
    useState, 
    useMemo, 
    useReducer,//操纵的是组件里的state
 } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Slider from './Slider.jsx';
import { ORDER_DEPART } from './constant';
import './Bottom.css';

function checkedReducer(state, action) {//实现reducer函数
    const { type, payload } = action;
    let newState;

    switch (type) {
        case 'toggle'://切换
            newState = { ...state };
            if (payload in newState) {//存在就删除它
                delete newState[payload];
            } else {//不存在就添加他
                newState[payload] = true;
            }
            return newState;//返回新生成的状态
        case 'reset':
            return {};
        default:
    }

    return state;
}

const Filter = memo(function Filter(props) {//单个的备选项组件
    const { name, checked, value, dispatch } = props;

    return (
        <li
            className={classnames({ checked })}
            onClick={() => dispatch({ payload: value, type: 'toggle' })}
        >
            {name}
        </li>
    );
});

Filter.propTypes = {
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
};

const Option = memo(function Option(props) {//
    const { title,
         options,
          checkedMap,
           dispatch,//这里做了一层封装
         } = props;

    return (
        <div className="option">
            <h3>{title}</h3>
            <ul>
                {options.map(option => {//遍历各种备选项
                    return (
                        <Filter
                            key={option.value}
                            {...option}
                            checked={option.value in checkedMap}//option.value存在于checkedMap中则是被选中
                            dispatch={dispatch}
                        />
                    );
                })}
            </ul>
        </div>
    );
});

Option.propTypes = {
    title: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    checkedMap: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};

const BottomModal = memo(function BottomModal(props) {//总和筛选浮层
    const {
        ticketTypes,
        trainTypes,
        departStations,
        arriveStations,
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd,
        setCheckedTicketTypes,
        setCheckedTrainTypes,
        setCheckedDepartStations,
        setCheckedArriveStations,
        setDepartTimeStart,
        setDepartTimeEnd,
        setArriveTimeStart,
        setArriveTimeEnd,
        toggleIsFiltersVisible,
    } = props;

    const [//通过useReducer创建本地缓冲区
        localCheckedTicketTypes,
        localCheckedTicketTypesDispatch,
    ] = useReducer(checkedReducer, checkedTicketTypes, checkedTicketTypes => {
        return {
            ...checkedTicketTypes,
        };
    });

    const [localCheckedTrainTypes, localCheckedTrainTypesDispatch] = useReducer(
        checkedReducer,
        checkedTrainTypes,
        checkedTrainTypes => {
            return {
                ...checkedTrainTypes,
            };
        }
    );

    const [
        localCheckedDepartStations,
        localCheckedDepartStationsDispatch,
    ] = useReducer(
        checkedReducer,
        checkedDepartStations,
        checkedDepartStations => {
            return {
                ...checkedDepartStations,
            };
        }
    );

    const [
        localCheckedArriveStations,
        localCheckedArriveStationsDispatch,
    ] = useReducer(
        checkedReducer,
        checkedArriveStations,
        checkedArriveStations => {
            return {
                ...checkedArriveStations,
            };
        }
    );

    const [localDepartTimeStart, setLocalDepartTimeStart] = useState(//几个时间缓冲区
        departTimeStart
    );
    const [localDepartTimeEnd, setLocalDepartTimeEnd] = useState(departTimeEnd);
    const [localArriveTimeStart, setLocalArriveTimeStart] = useState(
        arriveTimeStart
    );
    const [localArriveTimeEnd, setLocalArriveTimeEnd] = useState(arriveTimeEnd);

    const optionGroup = [//不定项选项
        {
            title: '坐席类型',//标题
            options: ticketTypes,//选项
            checkedMap: localCheckedTicketTypes,//哪些被选中
            dispatch: localCheckedTicketTypesDispatch,
        },
        {
            title: '车次类型',
            options: trainTypes,
            checkedMap: localCheckedTrainTypes,//注意这里使用的是本地的版本,加上了local前缀
            dispatch: localCheckedTrainTypesDispatch,
        },
        {
            title: '出发车站',
            options: departStations,
            checkedMap: localCheckedDepartStations,
            dispatch: localCheckedDepartStationsDispatch,
        },
        {
            title: '到达车站',
            options: arriveStations,
            checkedMap: localCheckedArriveStations,
            dispatch: localCheckedArriveStationsDispatch,
        },
    ];

    function sure() {//点击确定按钮
        //下面的set...函数不再是简单的actionCreator函数，我们在App.jsx中使用了bindActionCreators，现在是dispqtch相对于的action
        setCheckedTicketTypes(localCheckedTicketTypes);//将缓冲区中的数据传入redux中的store
        setCheckedTrainTypes(localCheckedTrainTypes);
        setCheckedDepartStations(localCheckedDepartStations);
        setCheckedArriveStations(localCheckedArriveStations);

        setDepartTimeStart(localDepartTimeStart);
        setDepartTimeEnd(localDepartTimeEnd);

        setArriveTimeStart(localArriveTimeStart);
        setArriveTimeEnd(localArriveTimeEnd);

        toggleIsFiltersVisible();//关闭浮层
    }

    const isResetDisabled = useMemo(() => {//代表什么时候不可以重置
        return (
            Object.keys(localCheckedTicketTypes).length === 0 &&//检查座椅车次等有没有被选中
            Object.keys(localCheckedTrainTypes).length === 0 &&
            Object.keys(localCheckedDepartStations).length === 0 &&
            Object.keys(localCheckedArriveStations).length === 0 &&
            localDepartTimeStart === 0 &&
            localDepartTimeEnd === 24 &&
            localArriveTimeStart === 0 &&
            localArriveTimeEnd === 24
        );
    }, [
        localCheckedTicketTypes,
        localCheckedTrainTypes,
        localCheckedDepartStations,
        localCheckedArriveStations,
        localDepartTimeStart,
        localDepartTimeEnd,
        localArriveTimeStart,
        localArriveTimeEnd,
    ]);

    function reset() {
        if (isResetDisabled) {//因为重置按钮不是用的标签<button>,所以事实上还是可以点击的，只是恰好点击也没用
            //如果为true,直接return
            return;
        }

        localCheckedTicketTypesDispatch({ type: 'reset' });
        localCheckedTrainTypesDispatch({ type: 'reset' });
        localCheckedDepartStationsDispatch({ type: 'reset' });
        localCheckedArriveStationsDispatch({ type: 'reset' });
        setLocalDepartTimeStart(0);
        setLocalDepartTimeEnd(24);
        setLocalArriveTimeStart(0);
        setLocalArriveTimeEnd(24);
    }

    return (
        <div className="bottom-modal">
            <div className="bottom-dialog">
                <div className="bottom-dialog-content">
                    <div className="title">
                        <span
                            className={classnames('reset', {
                                disabled: isResetDisabled,//isResetDisabled为true的时候，加一个样式，这是按钮不可点击
                            })}
                            onClick={reset}
                        >
                            重置
                        </span>
                        <span className="ok" onClick={sure}>
                            确定
                        </span>
                    </div>
                    <div className="options">
                        {optionGroup.map(group => (//遍历optionGroup数组，渲染<Option>组件，group对象里边就要就有数据options
                            <Option {...group} key={group.title} />
                        ))}
                        <Slider  //时间滑块组件
                            title="出发时间"
                            currentStartHours={localDepartTimeStart}
                            currentEndHours={localDepartTimeEnd}
                            onStartChanged={setLocalDepartTimeStart}
                            onEndChanged={setLocalDepartTimeEnd}
                        />
                        <Slider
                            title="到达时间"
                            currentStartHours={localArriveTimeStart}
                            currentEndHours={localArriveTimeEnd}
                            onStartChanged={setLocalArriveTimeStart}
                            onEndChanged={setLocalArriveTimeEnd}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

BottomModal.propTypes = {
    ticketTypes: PropTypes.array.isRequired,
    trainTypes: PropTypes.array.isRequired,
    departStations: PropTypes.array.isRequired,
    arriveStations: PropTypes.array.isRequired,
    checkedTicketTypes: PropTypes.object.isRequired,
    checkedTrainTypes: PropTypes.object.isRequired,
    checkedDepartStations: PropTypes.object.isRequired,
    checkedArriveStations: PropTypes.object.isRequired,
    departTimeStart: PropTypes.number.isRequired,
    departTimeEnd: PropTypes.number.isRequired,
    arriveTimeStart: PropTypes.number.isRequired,
    arriveTimeEnd: PropTypes.number.isRequired,
    setCheckedTicketTypes: PropTypes.func.isRequired,
    setCheckedTrainTypes: PropTypes.func.isRequired,
    setCheckedDepartStations: PropTypes.func.isRequired,
    setCheckedArriveStations: PropTypes.func.isRequired,
    setDepartTimeStart: PropTypes.func.isRequired,
    setDepartTimeEnd: PropTypes.func.isRequired,
    setArriveTimeStart: PropTypes.func.isRequired,
    setArriveTimeEnd: PropTypes.func.isRequired,
    toggleIsFiltersVisible: PropTypes.func.isRequired,
};

export default function Bottom(props) {
    const {
        toggleOrderType,
        toggleHighSpeed,
        toggleOnlyTickets,
        toggleIsFiltersVisible,
        highSpeed,
        orderType,
        onlyTickets,
        isFiltersVisible,

        ticketTypes,
        trainTypes,
        departStations,
        arriveStations,
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd,
        setCheckedTicketTypes,
        setCheckedTrainTypes,
        setCheckedDepartStations,
        setCheckedArriveStations,
        setDepartTimeStart,
        setDepartTimeEnd,
        setArriveTimeStart,
        setArriveTimeEnd,
    } = props;

    const noChecked = useMemo(() => {//该变量影响综合筛选按钮的样式   
        return (
            Object.keys(checkedTicketTypes).length === 0 &&
            Object.keys(checkedTrainTypes).length === 0 &&
            Object.keys(checkedDepartStations).length === 0 &&
            Object.keys(checkedArriveStations).length === 0 &&
            departTimeStart === 0 &&
            departTimeEnd === 24 &&
            arriveTimeStart === 0 &&
            arriveTimeEnd === 24
        );
    }, [
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd,
    ]);

    return (
        <div className="bottom">
            <div className="bottom-filters">
                <span className="item" onClick={toggleOrderType}>
                    <i className="icon">&#xf065;</i>
                    {orderType === ORDER_DEPART ? '出发 早→晚' : '耗时 短→长'}
                </span>
                <span
                    className={classnames('item', { 'item-on': highSpeed })}
                    onClick={toggleHighSpeed}
                >
                    <i className="icon">{highSpeed ? '\uf43f' : '\uf43e'}</i>
                    只看高铁动车
                </span>
                <span
                    className={classnames('item', { 'item-on': onlyTickets })}
                    onClick={toggleOnlyTickets}
                >
                    <i className="icon">{onlyTickets ? '\uf43d' : '\uf43c'}</i>
                    只看有票
                </span>
                <span
                    className={classnames('item', {
                        'item-on': isFiltersVisible || !noChecked,
                    })}
                    onClick={toggleIsFiltersVisible}
                >
                    <i className="icon">{noChecked ? '\uf0f7' : '\uf446'}</i>
                    综合筛选
                </span>
            </div>
            {isFiltersVisible && (
                <BottomModal
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
                    setCheckedTicketTypes={setCheckedTicketTypes}
                    setCheckedTrainTypes={setCheckedTrainTypes}
                    setCheckedDepartStations={setCheckedDepartStations}
                    setCheckedArriveStations={setCheckedArriveStations}
                    setDepartTimeStart={setDepartTimeStart}
                    setDepartTimeEnd={setDepartTimeEnd}
                    setArriveTimeStart={setArriveTimeStart}
                    setArriveTimeEnd={setArriveTimeEnd}
                    toggleIsFiltersVisible={toggleIsFiltersVisible}//用来关闭综合选择浮层
                />
            )}
        </div>
    );
}

Bottom.propTypes = {
    toggleOrderType: PropTypes.func.isRequired,
    toggleHighSpeed: PropTypes.func.isRequired,
    toggleOnlyTickets: PropTypes.func.isRequired,
    toggleIsFiltersVisible: PropTypes.func.isRequired,
    highSpeed: PropTypes.bool.isRequired,
    orderType: PropTypes.number.isRequired,
    onlyTickets: PropTypes.bool.isRequired,
    isFiltersVisible: PropTypes.bool.isRequired,

    ticketTypes: PropTypes.array.isRequired,
    trainTypes: PropTypes.array.isRequired,
    departStations: PropTypes.array.isRequired,
    arriveStations: PropTypes.array.isRequired,
    checkedTicketTypes: PropTypes.object.isRequired,
    checkedTrainTypes: PropTypes.object.isRequired,
    checkedDepartStations: PropTypes.object.isRequired,
    checkedArriveStations: PropTypes.object.isRequired,
    departTimeStart: PropTypes.number.isRequired,
    departTimeEnd: PropTypes.number.isRequired,
    arriveTimeStart: PropTypes.number.isRequired,
    arriveTimeEnd: PropTypes.number.isRequired,
    setCheckedTicketTypes: PropTypes.func.isRequired,
    setCheckedTrainTypes: PropTypes.func.isRequired,
    setCheckedDepartStations: PropTypes.func.isRequired,
    setCheckedArriveStations: PropTypes.func.isRequired,
    setDepartTimeStart: PropTypes.func.isRequired,
    setDepartTimeEnd: PropTypes.func.isRequired,
    setArriveTimeStart: PropTypes.func.isRequired,
    setArriveTimeEnd: PropTypes.func.isRequired,
};
