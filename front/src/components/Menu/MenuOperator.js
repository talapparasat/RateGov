import React,{Component} from 'react';
import {Link} from "react-router-dom";
import {Icon,Menu} from "antd";


class MenuOperator extends Component{
    constructor(){
        super();
        this.state={

        }
    }

    render() {
        const {locationKey}=this.props;
        let selectedKey='1';

        if(locationKey.startsWith('service')){
            selectedKey='2'
        }
        else if(locationKey.startsWith('reviews')){
            selectedKey='3'
        }
        else if(locationKey.startsWith('settings')){
            selectedKey='4'
        }
        else if(locationKey.startsWith('help')){
            selectedKey='5'
        }
        return(

            <Menu mode="inline" style={{textAlign:'left'}}  defaultSelectedKeys={[selectedKey]}>
                <div style={{padding:"20px 0"}} className="logo">
                    <img src="/assets/logo.png" alt="logo"/>
                </div>
                <Menu.Item  key="1">
                    <Link to={'/dashboard'}>
                        <Icon type="home" />
                        <span>Главная</span>
                    </Link>
                </Menu.Item>
                <Menu.Item  key="2">
                    <Link to={'/dashboard/service'}>
                        <Icon type="down-circle" />
                        <span>Услуги</span>
                    </Link>
                </Menu.Item>
                <Menu.Item  key="3">
                    <Link to={'/dashboard/reviews'}>
                        <Icon type="mail" />
                        <span>Отзывы</span>
                    </Link>
                </Menu.Item>
                <hr style={{width:'80%',margin:'40px auto'}}/>
                <Menu.Item key="4">
                    <Link to={'/dashboard/settings'}>
                        <Icon type="setting" />
                        <span>Настройки</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="5">
                    <Link to={'/dashboard/help'}>
                        <Icon type="question-circle" />
                        <span>Помощь</span>
                    </Link>
                </Menu.Item>
            </Menu>
        )
    }
}
export default MenuOperator;