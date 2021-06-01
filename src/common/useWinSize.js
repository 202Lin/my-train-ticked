//在计算滑块可滑动区域的宽度的时候只计算了一次，一旦浏览器窗口尺寸发送变化，百分比计算会出错
// 使用自定义hook来监听窗口的变化   
import { useState, useEffect } from 'react';

export default function useWinSize() {
    const [width, setWidth] = useState(document.documentElement.clientWidth);//获取初始浏览器宽高
    const [height, setHeight] = useState(document.documentElement.clientHeight);

    const onResize = () => {//响应事件
        setWidth(document.documentElement.clientWidth);//设置宽高
        setHeight(document.documentElement.clientHeight);
    };

    useEffect(() => {
        window.addEventListener('resize', onResize, false);//监听事件

        return () => {
            window.removeEventListener('resize', onResize, false);
        };
    }, []);

    return { width, height };
}
