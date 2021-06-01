import axios from 'axios'
export const ACTION_SET_FROM = 'SET_FROM';
export const ACTION_SET_TO = 'SET_TO';
export const ACTION_SET_IS_CITY_SELECTOR_VISIBLE =
    'SET_IS_CITY_SELECTOR_VISIBLE';
export const ACTION_SET_CURRENT_SELECTING_LEFT_CITY =
    'SET_CURRENT_SELECTING_LEFT_CITY';
export const ACTION_SET_CITY_DATA = 'SET_CITY_DATA';
export const ACTION_SET_IS_LOADING_CITY_DATA = 'SET_IS_LOADING_CITY_DATA';
export const ACTION_SET_IS_DATE_SELECTOR_VISIBLE =
    'SET_IS_DATE_SELECTOR_VISIBLE';
export const ACTION_SET_HIGH_SPEED = 'SET_HIGH_SPEED';
export const ACTION_SET_DEPART_DATE = 'SET_DEPART_DATE';

export function setFrom(from) {//创建action的函数，一般是返回一个对象
    return {
        type: ACTION_SET_FROM,
        payload: from,
    };
}

export function setTo(to) {
    return {
        type: ACTION_SET_TO,
        payload: to,
    };
}

export function setIsLoadingCityData(isLoadingCityData) {
    return {
        type: ACTION_SET_IS_LOADING_CITY_DATA,
        payload: isLoadingCityData,
    };
}

export function setCityData(cityDate) {
    return {
        type: ACTION_SET_CITY_DATA,
        payload: cityDate,
    };
}

export function toggleHighSpeed() {
    /*在store里边引入了react-thunk这个中间件后，
    dispatch一个函数，当发现dispatch的参数是一个函数的时候，react会负责调用这个函数，并将dispatch作为参数传递给这个函数 */
    //所以这里是还会传入getState这个函数吗
    return (dispatch, getState) => {//返回一个函数，函数参数有dispatch,和getState
        const { highSpeed } = getState();
        dispatch({
            type: ACTION_SET_HIGH_SPEED,
            payload: !highSpeed,
        });
    };
}

export function showCitySelector(currentSelectingLeftCity) {
    return dispatch => {
        dispatch({
            type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
            payload: true,
        });

        dispatch({
            type: ACTION_SET_CURRENT_SELECTING_LEFT_CITY,
            payload: currentSelectingLeftCity,
        });
    };
}

export function hideCitySelector() {
    return {
        type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
        payload: false,
    };
}

export function setSelectedCity(city) {//将我们在城市列表里面选择的城市回填到选择页面
    return (dispatch, getState) => {
        const { currentSelectingLeftCity } = getState();

        if (currentSelectingLeftCity) {
            dispatch(setFrom(city));
        } else {
            dispatch(setTo(city));
        }

        dispatch(hideCitySelector());//关闭城市选择浮层
    };
}

export function showDateSelector() {
    return {
        type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
        payload: true,
    };
}

export function hideDateSelector() {
    return {
        type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
        payload: false,
    };
}

export function exchangeFromTo() {
    return (dispatch, getState) => {//getState就是获取到store里面的state,这应该也是react-thunk放进去的方法
        const { from, to } = getState();
        dispatch(setFrom(to));
        dispatch(setTo(from));
    };
}

export function setDepartDate(departDate) {
    return {
        type: ACTION_SET_DEPART_DATE,
        payload: departDate,
    };
}

export function fetchCityData() {//发起异步请求
    return (dispatch, getState) => {
        const { isLoadingCityData } = getState();

        if (isLoadingCityData) {//正在请求的话就什么都不做
            return;
        }

        const cache = JSON.parse(//获取缓存
            localStorage.getItem('city_data_cache') || '{}'
        );

        if (Date.now() < cache.expires) {//如果没过期
            dispatch(setCityData(cache.data));//使用

            return;
        }

        dispatch(setIsLoadingCityData(true));//把是否请求数据的状态改为真

        axios.get('/static/cities')
            .then(
                res => {

                    dispatch(setCityData(res.data));
                    dispatch(setIsLoadingCityData(false));//把是否请求数据的状态改为假

                    localStorage.setItem(//将请求的数据写入缓存
                        'city_data_cache',
                        JSON.stringify({
                            expires:Date.now()+60*1000,
                            data:res.data,
                        })
                    )
                
                }
            )//得到json格式的数据
            .catch(() => {
                //console.log('000000000000000')
                dispatch(setIsLoadingCityData(false));//把是否请求数据的状态改为假
            });
    };
}
