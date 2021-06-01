import React, { useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';//简体中文，
import './Nav.css';

const Nav = memo(function Nav(props) {
    const { 
            date,//当前日期的时间戳
            prev,//向前一天的点击响应
            next, //后一天
            isPrevDisabled,//前一天是否不可用 
            isNextDisabled,//后一天
         } = props;

    const currentString = useMemo(() => {//日期的字符串比表示
        const d = dayjs(date);
        return d.format('M月D日 ') + d.locale('zh-cn').format('ddd');//可以看一下locale这个api
    }, [date]);

    return (
        <div className="nav">
            <span
                onClick={prev}//其实切换出发日期，列表数据会变化这个后端可以做一下，因为视频里面的后端也只是没发起一次请求把数据数组前后颠倒一下，造成数据切换了的错觉哈哈哈
                className={classnames('nav-prev', {//动态样式
                    'nav-disabled': isPrevDisabled,
                })}
            >
                前一天
            </span>
            <span className="nav-current">{currentString}</span>
            <span
                onClick={next}
                className={classnames('nav-next', {
                    'nav-disabled': isNextDisabled,
                })}
            >
                后一天
            </span>
        </div>
    );
});

export default Nav;

Nav.propTypes = {
    date: PropTypes.number.isRequired,
    prev: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
    isPrevDisabled: PropTypes.bool.isRequired,
    isNextDisabled: PropTypes.bool.isRequired,
};
