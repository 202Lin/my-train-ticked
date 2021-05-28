import React,{useMemo} from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import {h0} from '../common/fp'
import './DapartDate.css'

export default function DapartDate(props) {
    const {time,onClick} = props
    const h0ofDepart = h0(time)//利用定义好的h0函数去掉小时，分钟，秒
    const departDate = new Date(h0ofDepart)//又把他变成时间戳

    const departDateString = useMemo(() => {
        return dayjs(h0ofDepart).format('YYYY-MM-DD')//使用dayjs改变时间格式
    },[h0ofDepart])

    const isToday = h0ofDepart === h0()//定义h0的时候给了默认参数(现在时间)

    const weekString = '周'+['日','一','二','三','四','五','六'][departDate.getDay()]+(isToday?'(今天)':'')//getDay返回一周的某一天数字。终究还是见识短浅了

    return (<div className="depart-date" onClick={onClick}>
        <input type="hidden" name="date" value={departDateString}/>
        {departDateString}<span className="depart-week">{weekString}</span>
    </div>)
}

DapartDate.prototype = {
    time:PropTypes.number.isRequired,
    onClick:PropTypes.func.isRequired,
}