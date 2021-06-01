import React,{memo,useState,useMemo,useRef,useEffect} from 'react'
import PropTypes from 'prop-types'
import leftPad from 'left-pad'

import useWinSize from '../common/useWinSize'
import './Slider.css'

const Slider = memo(function Slider(props) {
    const {
        title,
        currentStartHours,
        currentEndHours,
        onStartChanged,
        onEndChanged,
    } = props

    const winSize = useWinSize();//使用自定义函数返回浏览器页面宽高

    const startHandle = useRef();//左边滑块
    const endHandle = useRef();//右边滑块

    const lastStartX = useRef();//左侧滑块上一次的横坐标
    const lastEndX = useRef();//右

    const range = useRef();//获取元素dom，来计算距离
    const rangeWidth = useRef();//不是每次都需要重新计算，所以再用一个uesRef来保存这个变量
    //useRef可以用来保存不应该出发重新渲染的数据

    const prevCurrentStartHours = useRef(currentStartHours);//记录上一次传入的currentStartHours
    const prevCurrentEndHours = useRef(currentEndHours);
  /*在Slider内部再做一层缓冲区，拖动滑块跟新的是二级缓冲区的数据
  这里面的数据再来更新滑块的位置，同时用副作用把数据通过callback
  更新到bottom中去，避免了拖动滑块或重新渲染真个Slider组件的问题
  交互性能更好*/  

  const [start, setStart] = useState(() => (currentStartHours / 24) * 100);//将时间转化为百分比的形式
  const [end, setEnd] = useState(() => (currentEndHours / 24) * 100);
  /*老师说的这里面的参数用函数是为了Slider组件只有在第一次渲染的时候才会调用这两个函数，优化了性能
  直接把一个值作为参数的话，好像是会执行吗？*/

  //比较本次和上次的值，如果有变动就更新Start的值
  if (prevCurrentStartHours.current !== currentStartHours) {
    setStart((currentStartHours / 24) * 100);
    //老师这里说react允许你在渲染过程中改变state的值，能够保证在最终指挥更新dom节点一次
    //死循环倒是很有可能
    prevCurrentStartHours.current = currentStartHours;
}

if (prevCurrentEndHours.current !== currentEndHours) {
    setEnd((currentEndHours / 24) * 100);
    prevCurrentEndHours.current = currentEndHours;
}

  const startPercent = useMemo(() => {//start和end可能因为精度问题导致有溢出，所以设一层限制
    //其实这里的限制我体会不太到
    if (start > 100) {
        return 100;
    }

    if (start < 0) {
        return 0;
    }

    return start;
}, [start]);

const endPercent = useMemo(() => {
    if (end > 100) {
        return 100;
    }

    if (end < 0) {
        return 0;
    }

    return end;
}, [end]);
const startHours = useMemo(() => {//又将百分比转换为24小时制的
    return Math.round((startPercent * 24) / 100);//取整
}, [startPercent]);

const endHours = useMemo(() => {
    return Math.round((endPercent * 24) / 100);
}, [endPercent]);

const startText = useMemo(() => {//给数字后边加上00,为了美观还给0-9左边补零，使用了插件left-pad
    return leftPad(startHours, 2, '0') + ':00';//补成两位，少的用0补
}, [startHours]);

const endText = useMemo(() => {
    return leftPad(endHours, 2, '0') + ':00';
}, [endHours]);

function onStartTouchBegin(e) {//设置左侧滑块的初始值
    const touch = e.targetTouches[0];
    lastStartX.current = touch.pageX;
}

function onEndTouchBegin(e) {//右侧滑块的初始值
    const touch = e.targetTouches[0];
    lastEndX.current = touch.pageX;
}

function onStartTouchMove(e) {
    const touch = e.targetTouches[0];
    const distance = touch.pageX - lastStartX.current;//距离等于当前横坐标减去上一次的横坐标
    lastStartX.current = touch.pageX;//更新上一次的横坐标为当前坐标

    setStart(start => start + (distance / rangeWidth.current) * 100);
    //更新滑块的位置，而且要注意滑块的位置是用百分比来表示的，这里需要转换一下
}

function onEndTouchMove(e) {
    const touch = e.targetTouches[0];
    const distance = touch.pageX - lastEndX.current;
    lastEndX.current = touch.pageX;

    setEnd(end => end + (distance / rangeWidth.current) * 100);
}

useEffect(() => {//获取可滑动区域的宽度
    rangeWidth.current = parseFloat(
        window.getComputedStyle(range.current).width
    );
}, [winSize.width]);//一旦浏览器的宽度发生变化，副作用重新计算

useEffect(() => {//给dom绑定事件监听
    startHandle.current.addEventListener(
        'touchstart',
        onStartTouchBegin,
        false
    );
    startHandle.current.addEventListener(
        'touchmove',
        onStartTouchMove,
        false
    );
    endHandle.current.addEventListener(
        'touchstart',
        onEndTouchBegin,
        false
    );
    endHandle.current.addEventListener('touchmove', onEndTouchMove, false);

    return () => {//解绑

        /*事实上这里需要对监听事件解绑，但是我一加上解除监听事件就会报错，解决不了，不会解决*/
        // startHandle.current.removeEventListener(
        //     'touchmove',
        //     onStartTouchMove,
        //     false
        // );
        // startHandle.current.removeEventListener(
        //     'touchstart',
        //     onStartTouchBegin,
        //     false
        // );

        // endHandle.current.removeEventListener(
        //     'touchstart',
        //     onEndTouchBegin,
        //     false
        // );
        // endHandle.current.removeEventListener(
        //     'touchmove',
        //     onEndTouchMove,
        //     false
        // );
    };
});//没有给第二个参数，这就意味着每次组件渲染都会执行，因为渲染可能导致dom节点重构，所以要重新绑定事件，同时解绑事件，不用担心内值泄漏

useEffect(() => {//将数据的变动上报给bottom组件。使用useEffect来监听
    onStartChanged(startHours);
}, [startHours]);

useEffect(() => {
    onEndChanged(endHours);
}, [endHours]);

return (
    <div className="option">
        <h3>{title}</h3>
        <div className="range-slider">
            <div className="slider" ref={range}>
                <div
                    className="slider-range"
                    style={{
                        left: startPercent + '%',
                        width: endPercent - startPercent + '%',
                    }}
                ></div>
                <i
                    ref={startHandle}
                    className="slider-handle"
                    style={{
                        left: startPercent + '%',
                    }}
                >
                    <span>{startText}</span>
                </i>
                <i
                    ref={endHandle}
                    className="slider-handle"
                    style={{
                        left: endPercent + '%',
                    }}
                >
                    <span>{endText}</span>
                </i>
            </div>
        </div>
    </div>
);
})



Slider.propTypes = {
    title: PropTypes.string.isRequired,
    currentStartHours: PropTypes.number.isRequired,
    currentEndHours: PropTypes.number.isRequired,
    onStartChanged: PropTypes.func.isRequired,
    onEndChanged: PropTypes.func.isRequired,
}

export default Slider