export function h0(timestamp = Date.now()) {//不传则默认处理当前时间
    const target = new Date(timestamp);//把时间戳转换成data对象

    target.setHours(0);
    target.setMinutes(0);
    target.setSeconds(0);
    target.setMilliseconds(0);

    return target.getTime();
}