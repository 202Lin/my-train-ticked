import React, { memo } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import './Choose.css';

const Choose = memo(function Choose(props) {
    const { passengers, updatePassenger } = props;

    function createSeat(seatType) {
        return (
            <div>
                {passengers.map(passenger => {//使用内部函数来渲染jsx，性能是有缺陷的，可以尝试了解更优的方法
                    return (
                        <p
                            key={passenger.id}
                            className={classnames('seat', {
                                active: passenger.seat === seatType,
                            })}
                            data-text={seatType}//，自定义属性，  这里结合css样式编写去理解
                            onClick={() =>
                                updatePassenger(passenger.id, {
                                    seat: seatType,
                                })
                            }
                        >
                            &#xe02d;
                        </p>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="choose">
            <p className="tip">在线选座</p>
            <div className="container">
                <div className="seats">
                    <div>窗</div>
                    {createSeat('A')}
                    {createSeat('B')}
                    {createSeat('C')}
                    <div>过道</div>
                    {createSeat('D')}
                    {createSeat('F')}
                    <div>窗</div>
                </div>
            </div>
        </div>
    );
});

Choose.propTypes = {
    passengers: PropTypes.array.isRequired,
    updatePassenger: PropTypes.func.isRequired,
};

export default Choose;
