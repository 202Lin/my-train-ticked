//每一个action都会流经每一个reducer
import {
    ACTION_SET_FROM,
    ACTION_SET_TO,
    ACTION_SET_DEPART_DATE,
    ACTION_SET_HIGH_SPEED,
    ACTION_SET_TRAIN_LIST,
    ACTION_SET_ORDER_TYPE,
    ACTION_SET_ONLY_TICKETS,
    ACTION_SET_TICKET_TYPES,
    ACTION_SET_CHECKED_TICKET_TYPES,
    ACTION_SET_TRAIN_TYPES,
    ACTION_SET_CHECKED_TRAIN_TYPES,
    ACTION_SET_DEPART_STATIONS,
    ACTION_SET_CHECKED_DEPART_STATIONS,
    ACTION_SET_ARRIVE_STATIONS,
    ACTION_SET_CHECKED_ARRIVE_STATIONS,
    ACTION_SET_DEPART_TIME_START,
    ACTION_SET_DEPART_TIME_END,
    ACTION_SET_ARRIVE_TIME_START,
    ACTION_SET_ARRIVE_TIME_END,
    ACTION_SET_IS_FILTERS_VISIBLE,
    ACTION_SET_SEARCH_PARSED,
} from './actions';
import { ORDER_DEPART } from './constant';

const reducers = {
    from(state = null, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_FROM:
                return payload;
            default:
        }

        return state;
    },
    to(state = null, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_TO:
                return payload;
            default:
        }

        return state;
    },
    departDate(state = Date.now(), action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_DEPART_DATE:
                return payload;
            default:
        }

        return state;
    },
    highSpeed(state = false, action) {//也要做一次数据联动
        const { type, payload } = action;
        let checkedTrainTypes;

        switch (type) {
            case ACTION_SET_HIGH_SPEED:
                return payload;
            case ACTION_SET_CHECKED_TRAIN_TYPES://监听checkedTrainTypes的变化
                checkedTrainTypes = payload;
                return Boolean(checkedTrainTypes[1] && checkedTrainTypes[5]);//综合筛选中选了key值为1和5的，也就相当于选了高铁动车
            default:
        }

        return state;
    },
    trainList(state = [], action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_TRAIN_LIST:
                return payload;
            default:
        }

        return state;
    },
    orderType(state = ORDER_DEPART, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_ORDER_TYPE:
                return payload;
            default:
        }

        return state;
    },
    onlyTickets(state = false, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_ONLY_TICKETS:
                return payload;
            default:
        }

        return state;
    },
    ticketTypes(state = [], action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_TICKET_TYPES:
                return payload;
            default:
        }

        return state;
    },
    checkedTicketTypes(state = {}, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_CHECKED_TICKET_TYPES:
                return payload;
            default:
        }

        return state;
    },
    trainTypes(state = [], action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_TRAIN_TYPES:
                return payload;
            default:
        }

        return state;
    },
    checkedTrainTypes(state = {}, action) {//选中的车次类型
        const { type, payload } = action;

        let highSpeed;
        let newCheckedTrainTypes;

        switch (type) {
            case ACTION_SET_CHECKED_TRAIN_TYPES:
                return payload;
            case ACTION_SET_HIGH_SPEED://，捕获对highSpeed的更新如果在之前选择则过只看高铁，这里要做一个数据联动
                highSpeed = payload;
                newCheckedTrainTypes = { ...state };//拷贝一份当前的checkedTrainTypes

                if (highSpeed) {//两个高铁动车的key分别是1和5
                    newCheckedTrainTypes[1] = true;
                    newCheckedTrainTypes[5] = true;
                } else {//如果没选择高铁动车,则将这两个选项从可选项里面移出
                    delete newCheckedTrainTypes[1];
                    delete newCheckedTrainTypes[5];
                }

                return newCheckedTrainTypes;
            default:
        }

        return state;
    },
    departStations(state = [], action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_DEPART_STATIONS:
                return payload;
            default:
        }

        return state;
    },
    checkedDepartStations(state = {}, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_CHECKED_DEPART_STATIONS:
                return payload;
            default:
        }

        return state;
    },
    arriveStations(state = [], action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_ARRIVE_STATIONS:
                return payload;
            default:
        }

        return state;
    },
    checkedArriveStations(state = {}, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_CHECKED_ARRIVE_STATIONS:
                return payload;
            default:
        }

        return state;
    },
    departTimeStart(state = 0, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_DEPART_TIME_START:
                return payload;
            default:
        }

        return state;
    },
    departTimeEnd(state = 24, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_DEPART_TIME_END:
                return payload;
            default:
        }

        return state;
    },
    arriveTimeStart(state = 0, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_ARRIVE_TIME_START:
                return payload;
            default:
        }

        return state;
    },
    arriveTimeEnd(state = 24, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_ARRIVE_TIME_END:
                return payload;
            default:
        }

        return state;
    },
    isFiltersVisible(state = false, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_IS_FILTERS_VISIBLE:
                return payload;
            default:
        }

        return state;
    },
    searchParsed(state = false, action) {
        const { type, payload } = action;
        switch (type) {
            case ACTION_SET_SEARCH_PARSED:
                return payload;
            default:
        }

        return state;
    },
};
export default reducers
