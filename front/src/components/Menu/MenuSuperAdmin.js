import React,{Component} from 'react';
import {Link} from "react-router-dom";
import {Icon,Menu} from "antd";


class MenuSuperAdmin extends Component{
    constructor(){
        super();
        this.state={

        }
    }

    render() {
        const {locationKey}=this.props;
        let selectedKey='1';
        if(locationKey.startsWith('organizations')){
            selectedKey='2'
        }
        else if(locationKey.startsWith('admin')){
            selectedKey='3'
        }
        else if(locationKey.startsWith('supervisor')){
            selectedKey='4'
        }
        else if(locationKey.startsWith('operator')){
            selectedKey='5'
        }
        else if(locationKey.startsWith('observer')){
            selectedKey='6'
        }
        else if(locationKey.startsWith('service-type')){
            selectedKey='7'
        }
        else if(locationKey.startsWith('service')){
            selectedKey='8'
        }
        else if(locationKey.startsWith('category')){
            selectedKey='9'
        }
        else if(locationKey.startsWith('criteria')){
            selectedKey='10'
        }
        else if(locationKey.endsWith('provider')){
            selectedKey='11'
        }
        else if(locationKey.startsWith('reviews')){
            selectedKey='12'
        }
        else if(locationKey.startsWith('navigation')){
            selectedKey='13'
        }
        else if(locationKey.startsWith('field')){
            selectedKey='14'
        }
        else if(locationKey.startsWith('analytics')){
            selectedKey='15'
        }
        else if(locationKey.startsWith('settings')){
            selectedKey='16'
        }
        else if(locationKey.startsWith('help')){
            selectedKey='17'
        }
        return(

            <Menu mode="inline" style={{textAlign:'left'}}  defaultSelectedKeys={[selectedKey]}>
                <div style={{padding:"20px 0"}} className="logo">
                    <h2>Rate Gov</h2>
                    {/* <img src="/assets/logo.png" alt="logo"/> */}
                </div>
                <Menu.Item  key="1">
                    <Link to={'/dashboard'}>
                        <Icon type="home" />
                        <span>Главная</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link to={'/dashboard/organizations'}>
                        <Icon type="shop" />
                        <span>Организации</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="3">
                    <Link to={'/dashboard/admin'}>
                        <Icon type="star" />
                        <span>Администраторы</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="4">
                    <Link to={'/dashboard/supervisor'}>
                        <Icon type="minus-circle" />
                        <span>Cупервайзеры</span>
                    </Link>
                </Menu.Item>

                <Menu.Item key="5">
                    <Link to={'/dashboard/operator'}>
                        <Icon type="up-circle" />
                        <span>Операторы</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="6">
                    <Link to={'/dashboard/observer'}>
                        <Icon type="check-circle" />
                        <span>Наблюдатели</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="7">
                    <Link to={'/dashboard/service-type'}>
                        <Icon type="right-circle" />
                        <span>Типы услугодателей</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="8">
                    <Link to={'/dashboard/service'}>
                        <Icon type="down-circle" />
                        <span>Услуги</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="9">
                    <Link to={'/dashboard/category'}>
                        <Icon type="left-circle" />
                        <span>Категорий оценок</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="10">
                    <Link to={'/dashboard/criteria'}>
                        <Icon type="info-circle" />
                        <span>Критерий оценок</span>
                    </Link>
                </Menu.Item>
                <Menu.Item  key="11">
                    <Link to={'/dashboard/provider'}>
                        <Icon type="plus-circle" />
                        <span>Услугодатели</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="12">
                    <Link to={'/dashboard/reviews'}>
                        <Icon type="mail" />
                        <span>Отзывы</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="13">
                    <Link to={'/dashboard/navigation'}>
                        <Icon type="right" />
                        <span>Навигация</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="14">
                    <Link to={'/dashboard/fields'}>
                        <span>Дополнительные поля</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="15">
                    <Link to={'/dashboard/analytics'}>
                        <Icon type="line-chart" />
                        <span>Аналитика</span>
                    </Link>
                </Menu.Item>
                <hr style={{width:'80%',margin:'40px auto'}}/>
                <Menu.Item key="16">
                    <Link to={'/dashboard/settings'}>
                        <Icon type="setting" />
                        <span>Настройки</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="17">
                    <Link to={'/dashboard/help'}>
                        <Icon type="question-circle" />
                        <span>Помощь</span>
                    </Link>
                </Menu.Item>
            </Menu>
        )
    }
}
export default MenuSuperAdmin;