import React, { memo } from 'react';
import './Submit.css';

export default memo(function Submit() {//因为这个组件本来就在表单内部，所以就不需要props,功能就是单纯的
    return (
        <div className="submit">
            <button type="submit" className="submit-button">
                {' '}
                搜索{' '}
            </button>
        </div>
    );
});
