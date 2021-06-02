import axios from 'axios'

export const ACTION_SET_TRAIN_NUMBER = 'SET_TRAIN_NUMBER';
export const ACTION_SET_DEPART_STATION = 'SET_DEPART_STATION';
export const ACTION_SET_ARRIVE_STATION = 'SET_ARRIVE_STATION';
export const ACTION_SET_SEAT_TYPE = 'SET_SEAT_TYPE';
export const ACTION_SET_DEPART_DATE = 'SET_DEPART_DATE';
export const ACTION_SET_ARRIVE_DATE = 'SET_ARRIVE_DATE';
export const ACTION_SET_DEPART_TIME_STR = 'SET_DEPART_TIME_STR';
export const ACTION_SET_ARRIVE_TIME_STR = 'SET_ARRIVE_TIME_STR';
export const ACTION_SET_DURATION_STR = 'SET_DURATION_STR';
export const ACTION_SET_PRICE = 'SET_PRICE';
export const ACTION_SET_PASSENGERS = 'SET_PASSENGERS';
export const ACTION_SET_MENU = 'SET_MENU';
export const ACTION_SET_IS_MENU_VISIBLE = 'SET_IS_MENU_VISIBLE';
export const ACTION_SET_SEARCH_PARSED = 'SET_SEARCH_PARSED';

export function setTrainNumber(trainNumber) {
    return {
        type: ACTION_SET_TRAIN_NUMBER,
        payload: trainNumber,
    };
}
export function setDepartStation(departStation) {
    return {
        type: ACTION_SET_DEPART_STATION,
        payload: departStation,
    };
}
export function setArriveStation(arriveStation) {
    return {
        type: ACTION_SET_ARRIVE_STATION,
        payload: arriveStation,
    };
}
export function setSeatType(seatType) {
    return {
        type: ACTION_SET_SEAT_TYPE,
        payload: seatType,
    };
}
export function setDepartDate(departDate) {
    return {
        type: ACTION_SET_DEPART_DATE,
        payload: departDate,
    };
}
export function setArriveDate(arriveDate) {
    return {
        type: ACTION_SET_ARRIVE_DATE,
        payload: arriveDate,
    };
}
export function setDepartTimeStr(departTimeStr) {
    return {
        type: ACTION_SET_DEPART_TIME_STR,
        payload: departTimeStr,
    };
}
export function setArriveTimeStr(arriveTimeStr) {
    return {
        type: ACTION_SET_ARRIVE_TIME_STR,
        payload: arriveTimeStr,
    };
}
export function setDurationStr(durationStr) {
    return {
        type: ACTION_SET_DURATION_STR,
        payload: durationStr,
    };
}
export function setPrice(price) {
    return {
        type: ACTION_SET_PRICE,
        payload: price,
    };
}
export function setPassengers(passengers) {
    return {
        type: ACTION_SET_PASSENGERS,
        payload: passengers,
    };
}
export function setMenu(menu) {
    return {
        type: ACTION_SET_MENU,
        payload: menu,
    };
}
export function setIsMenuVisible(isMenuVisible) {
    return {
        type: ACTION_SET_IS_MENU_VISIBLE,
        payload: isMenuVisible,
    };
}
export function setSearchParsed(searchParsed) {
    return {
        type: ACTION_SET_SEARCH_PARSED,
        payload: searchParsed,
    };
}

export function fetchInitial(url) {//获取数据
    return (dispatch, getState) => {
        axios.get(url)
            .then(res => {
                const {
                    departTimeStr,
                    arriveTimeStr,
                    arriveDate,
                    durationStr,
                    price,
                } = res.data;

                dispatch(setDepartTimeStr(departTimeStr));
                dispatch(setArriveTimeStr(arriveTimeStr));
                dispatch(setArriveDate(arriveDate));
                dispatch(setDurationStr(durationStr));
                dispatch(setPrice(price));
            });
    };
}

let passengerIdSeed = 0;

export function createAdult() {//创建成人对象
    return (dispatch, getState) => {
        const { passengers } = getState();

        for (let passenger of passengers) {//检查先前的乘客信息是否有空缺，如果有空缺直接返回，不再创建新的乘客
            const keys = Object.keys(passenger);
            for (let key of keys) {
                if (!passenger[key]) {
                    return;
                }
            }
        }

        dispatch(
            setPassengers([//这是用到了拓展符运算，将后面的对象和前面的passengers合并了
                ...passengers,
                {
                    id: ++passengerIdSeed,//保证不重复
                    name: '',//姓名
                    ticketType: 'adult',
                    licenceNo: '',//身份证号
                    seat: 'Z',
                },
            ])
        );
    };
}

export function createChild() {
    return (dispatch, getState) => {
        const { passengers } = getState();

        let adultFound = null;

        for (let passenger of passengers) {//也要检查
            const keys = Object.keys(passenger);
            for (let key of keys) {
                if (!passenger[key]) {
                    return;
                }
            }

            if (passenger.ticketType === 'adult') {//检查当前乘客列表里面是否有成人，如果没有也是不行的
                adultFound = passenger.id;
            }
        }

        if (!adultFound) {
            alert('请至少正确添加一个同行成人');
            return;
        }

        dispatch(
            setPassengers([
                ...passengers,
                {
                    id: ++passengerIdSeed,
                    name: '',
                    gender: 'none',//性别
                    birthday: '',//出生日期
                    followAdult: adultFound,//同行成人
                    ticketType: 'child',
                    seat: 'Z',
                },
            ])
        );
    };
}

export function removePassenger(id) {//移出乘客信息
    return (dispatch, getState) => {//异步action
        const { passengers } = getState();

        const newPassengers = passengers.filter(passenger => {
            //删除与传入id匹配的乘客，如果成人乘客移出，与之同行的儿童乘客也要移出
            return passenger.id !== id && passenger.followAdult !== id;
        });

        dispatch(setPassengers(newPassengers));
    };
}

export function updatePassenger(id, data, keysToBeRemoved = []) {
    //input的onchange事件，即使更新用户输入的信息
    return (dispatch, getState) => {
        const { passengers } = getState();

        for (let i = 0; i < passengers.length; ++i) {
            if (passengers[i].id === id) {//反正就是更新用户填入的数据
                const newPassengers = [...passengers];
                newPassengers[i] = Object.assign({}, passengers[i], data);//这个传三个参数是咋个意思，待会搞定一下

                for (let key of keysToBeRemoved) {
                    delete newPassengers[i][key];//如果有就删除
                }

                dispatch(setPassengers(newPassengers));

                break;
            }
        }
    };
}

export function showMenu(menu) {//显示浮层
    return dispatch => {
        dispatch(setMenu(menu));
        dispatch(setIsMenuVisible(true));
    };
}

export function showGenderMenu(id) {//性别的弹出菜单
    return (dispatch, getState) => {
        const { passengers } = getState();

        const passenger = passengers.find(passenger => passenger.id === id);

        if (!passenger) {//若是乘客不存在，直接return，
            //因为乘客id都是在创建的时候就已经确定了，修改个人信息的时候就是根据id来确定修改的是哪个乘客的个人信息         return;
        }

        dispatch(
            showMenu({
                onPress(gender) {//点击响应
                    dispatch(updatePassenger(id, { gender }));//跟新
                    dispatch(hideMenu());//关闭菜单
                },
                options: [
                    {
                        title: '男',
                        value: 'male',
                        active: 'male' === passenger.gender,
                    },
                    {
                        title: '女',
                        value: 'female',
                        active: 'female' === passenger.gender,
                    },
                ],
            })
        );
    };
}

export function showFollowAdultMenu(id) {//选择可以跟随的成人
    return (dispatch, getState) => {
        const { passengers } = getState();

        const passenger = passengers.find(passenger => passenger.id === id);

        if (!passenger) {
            return;
        }

        dispatch(
            showMenu({
                onPress(followAdult) {
                    dispatch(updatePassenger(id, { followAdult }));
                    dispatch(hideMenu());
                },
                options: passengers
                    .filter(passenger => passenger.ticketType === 'adult')
                    .map(adult => {
                        return {
                            title: adult.name,
                            value: adult.id,
                            active: adult.id === passenger.followAdult,
                        };
                    }),
            })
        );
    };
}

export function showTicketTypeMenu(id) {//
    return (dispatch, getState) => {
        const { passengers } = getState();

        const passenger = passengers.find(passenger => passenger.id === id);

        if (!passenger) {
            return;
        }

        dispatch(
            showMenu({
                onPress(ticketType) {
                    if ('adult' === ticketType) {//将儿童票转为成人票
                        dispatch(
                            updatePassenger(//增加车票类型和身份证信息字段，删除性别，跟随人，出生年月三个信息字段
                                id,
                                {
                                    ticketType,
                                    licenceNo: '',
                                },
                                ['gender', 'followAdult', 'birthday']
                            )
                        );
                    } else {//将成人票转儿童票
                        const adult = passengers.find(
                            passenger =>
                                passenger.id === id &&
                                passenger.ticketType === 'adult'
                        );

                        if (adult) {//找到了，就修改信息字段
                            dispatch(
                                updatePassenger(
                                    id,
                                    {
                                        ticketType,
                                        gender: '',
                                        followAdult: adult.id,
                                        birthday: '',
                                    },
                                    ['licenceNo']
                                )
                            );
                        } else {//没找打
                            alert('没有其他成人乘客');
                        }
                    }

                    dispatch(hideMenu());//关闭菜单
                },
                options: [
                    {
                        title: '成人票',
                        value: 'adult',
                        active: 'adult' === passenger.ticketType,
                    },
                    {
                        title: '儿童票',
                        value: 'child',
                        active: 'child' === passenger.ticketType,
                    },
                ],
            })
        );
    };
}

export function hideMenu() {
    return setIsMenuVisible(false);
}
