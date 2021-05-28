import React, { useState,useMemo,useEffect,memo,useCallback } from 'react'
import classNames from 'classnames'//npm i classnames --save,用于方便使用动态类的问题
import PropsTypes from 'prop-types'
import './CitySelector.css'
import axios from 'axios';

const CityItem = memo(function CityItem(props) {//城市下=小单元格组件
    const { name, onSelect } = props;

    return (
        <li className="city-li" onClick={() => onSelect(name)}>
            {name}
        </li>
    );
});

CityItem.propTypes = {
    name: PropsTypes.string.isRequired,
    onSelect: PropsTypes.func.isRequired,
};

const CitySection = memo(function CitySection(props) {//根据字母分成的块组件
    const { title, cities = [], onSelect } = props;

    return (
        <ul className="city-ul">
            <li className="city-li" key="title" data-cate={title}>
                {/* 自定义属性data-cate，值为title，也就是块组件上边字母的值 */}
                {title}
            </li>
            {cities.map(city => {
                return (
                    <CityItem
                        key={city.name}
                        name={city.name}
                        onSelect={onSelect}
                    />
                );
            })}
        </ul>
    );
});

CitySection.propTypes = {
    title: PropsTypes.string.isRequired,
    cities: PropsTypes.array,
    onSelect: PropsTypes.func.isRequired,
};

const AlphaIndex = memo(function AlphaIndex(props) {//右边单个字母表组件
    const { alpha, onClick } = props;

    return (
        <i className="city-index-item" onClick={() => onClick(alpha)}>
            {alpha}
        </i>
    );
});

AlphaIndex.propTypes = {
    alpha: PropsTypes.string.isRequired,
    onClick: PropsTypes.func.isRequired,
};

const alphabet = Array.from(new Array(26), (ele, index) => {//Array.from() 方法从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例
    //创建一个长度为26的空数组，遍历将他转化字母
    return String.fromCharCode(65 + index);
});

const CityList = memo(function CityList(props) {//城市列表组件
    const { sections, onSelect,toAlpha } = props;

    return (
        <div className="city-list">
            <div className="city-cate">
                {sections.map(section => {
                    return (
                        <CitySection
                            key={section.title}
                            title={section.title}
                            cities={section.citys}
                            onSelect={onSelect}
                        />
                    );
                })}
            </div>
            <div className="city-index">
              {
                //   遍历字母表
                alphabet.map(alpha => {
                    return (
                        <AlphaIndex
                            key={alpha}
                            alpha={alpha}
                            onClick={toAlpha}
                        />
                    );
                })
              }  
            </div>
        </div>
    );
});

CityList.propTypes = {
    sections: PropsTypes.array.isRequired,
    onSelect: PropsTypes.func.isRequired,
    toAlpha: PropsTypes.func.isRequired,
};


const SuggestItem = memo(function SuggestItem(props) {//搜索结果展示组件
    const { name, onClick } = props;

    return (
        <li className="city-suggest-li" onClick={() => onClick(name)}>
            {name}
        </li>
    );
});

SuggestItem.propTypes = {
    name: PropsTypes.string.isRequired,
    onClick: PropsTypes.func.isRequired,
};

const Suggest = memo(function Suggest(props) {
    const { searchKey, onSelect } = props;

    const [result, setResult] = useState([]);

    useEffect(() => {//请求数据
        axios.get(`api1/rest/search?key=${encodeURIComponent(searchKey)}`)//这里是我自己用了代理，和老师课程上边的不一样，使用http-proxy-middleware,配置setupProxy.js文件
            .then(res => {
                //console.log('11111111')
                //const { result, searchKey: sKey } = res.data;
                //console.log(res.data)
                // if (sKey === searchKey) {//也不知道这里是干啥的。去掉应该没啥关系
                //     setResult(result);
                // }
                setResult(res.data.result)
            });
    }, [searchKey]);

    const fallBackResult = useMemo(() => {//根据数据是否请求到了做出不同变化
        if (!result.length) {//请求没有得到数据返回，便执行下面的语句
            return [
                {
                    display: searchKey,
                },
            ];
        }
        console.log('我不居然')
        return result;
    }, [result, searchKey]);

    return (
        <div className="city-suggest">
            <ul className="city-suggest-ul">
                {fallBackResult.map(item => {
                    return (
                        <SuggestItem
                            key={item.display}
                            name={item.display}
                            onClick={onSelect}
                        />
                    );
                })}
            </ul>
        </div>
    );
});

Suggest.propTypes = {
    searchKey: PropsTypes.string.isRequired,
    onSelect: PropsTypes.func.isRequired,
};

export default function CitySelector(props) {
    const {
        show,
        cityData,
        isLoading,
        onBack,
        fetchCityData,
        onSelect,
    } =props

    const [searchKey,setSearchKey] = useState('')//定义状态，管理输入框中的内容
    const key = useMemo(() =>searchKey.trim(),[searchKey])//去掉两边的空格

    useEffect(() => {
        if(!show || cityData || isLoading){//当城市选择图层没显示，已经存在数据，或者正在加载的时候不用执行函数
            return
        } else{
            //  (!show) = false
            // cityData = null
            //isLoading = false
            //console.log(isLoading)
            fetchCityData()
        }
    },[show,cityData,isLoading,fetchCityData])

    const toAlpha = useCallback(alpha => {//定义滚动到目标块组件的方法
        document.querySelector(`[data-cate='${alpha}']`).scrollIntoView();
    }, []);

    const outputCitySections = () => {//封装展示的逻辑
        if (isLoading) {//如果正在加载
            return <div>loading</div>;
        }

        if (cityData) {
            return (
                <CityList
                    sections={cityData.cityList}
                    onSelect={onSelect}
                    toAlpha={toAlpha}
                />
            );
        }

        return <div>error</div>;
    };

    return (
        <div className={classNames('city-selector',{hiddenList:!show})}>
            {/* 它居然是根据图层来切换页面的，感觉这种是不是会有些臃肿，数据变化页面也能够重新渲染吗？
            classNames是使用动态类的一个库写法还挺多的，随便的意思就是固定一个city-selector类，动态决定hidden类 
            开始默认是不显示这个组件的，显示后就是直接置顶，也搞不太清楚这里是咋搞的*/}
            <div className="city-search">
                <div className="search-back" onClick={() => onBack()}>
                    {/* <svg>是画内返回按钮 */}
                    <svg width="42" height="42">
                            <polyline
                                points="25,13 16,21 25,29"
                                stroke="#fff"
                                strokeWidth="2"
                                fill="none"
                            />
                        </svg>
                </div>
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        value={searchKey}
                        className="search-input"
                        placeholder="城市、车站的中文或拼音"
                        onChange={e => setSearchKey(e.target.value)}
                    />
                </div>
                <i
                onClick={() => setSearchKey('')}
                // 输入框里边有内容就显示这个小叉叉
                className={classNames('search-clean',{hidden:key.length === 0})}>
                &#xf063;
                </i>
            </div>
            {Boolean(key) && (
                <Suggest searchKey={key} onSelect={key => onSelect(key)} />
            )}
            {/* 感觉这个处理好棒，如果输入框中有内容，就渲染，suggest组件，就算没搜索到，也会显示输入的内容 */}
            {outputCitySections()}
        </div>
    )
}

CitySelector.prototype = {//对props的类型进行限制
    show:PropsTypes.bool.isRequired,
    cityData:PropsTypes.object,
    isLoading:PropsTypes.bool.isRequired,
    onBack:PropsTypes.func.isRequired,
    fetchCityData:PropsTypes.func.isRequired,
    onSelect:PropsTypes.func.isRequired,

}
