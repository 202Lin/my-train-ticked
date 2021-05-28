import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';

export default function Header(props) {
    const { onBack, title } = props;

    return (//整个组件时顶部
        <div className="header">
            <div className="header-back" onClick={onBack}>
                {/* 下面是使用svg画箭头 */}
                <svg width="42" height="42">
                    <polyline
                        points="25,13 16,21 25,29"
                        stroke="#fff"
                        strokeWidth="2"
                        fill="none"
                    />
                </svg>
            </div>
            <h1 className="header-title">{title}</h1>
        </div>
    );
}

Header.propTypes = {//对props的类型进行限制，可以对比一下，在类组件中propTypes使用上的区别
    onBack: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};
