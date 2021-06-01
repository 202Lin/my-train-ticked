//自定义hook
import { useCallback } from 'react';
import { h0 } from './fp';

export default function useNav(departDate, dispatch, prevDate, nextDate) {
    const isPrevDisabled = h0(departDate) <= h0();//出发日期不能小于当前日期
    const isNextDisabled = h0(departDate) - h0() > 20 * 86400 * 1000;//不能提前20天购票

    const prev = useCallback(() => {//前一天
        if (isPrevDisabled) {
            return;
        }
        dispatch(prevDate());
    }, [isPrevDisabled]);

    const next = useCallback(() => {//后一天
        if (isNextDisabled) {
            return;
        }
        dispatch(nextDate());
    }, [isNextDisabled]);

    return {
        isPrevDisabled,
        isNextDisabled,
        prev,
        next,
    };
}
