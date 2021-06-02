import React, { memo } from 'react';
import PropTypes from 'prop-types';
import './Ticket.css';

const Ticket = memo(function Ticket(props) {
    const { price, type } = props;
    return (
        <div className="ticket">
            <p>
                <span className="ticket-type">{type}</span>
                <span className="ticket-price">{price}</span>
            </p>
            <div className="label">坐席</div>
        </div>
    );
});

Ticket.propTypes = {
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),//可以是字符串也可以是数字
    //组件在url解析完成之后就会被渲染，这个时候异步请求的价格可能还没有返回，所以设置为非必须  
    type: PropTypes.string.isRequired,
};

export default Ticket;
