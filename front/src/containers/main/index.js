import React,{Component} from 'react'
import {withRouter} from 'react-router-dom';
import './main.css'
import {Icon, Dropdown, Divider, Col, Row} from "antd";
import Menu from "antd/es/menu";
import {Link} from "react-router-dom";

import {connect} from 'react-redux';
import Rate from "../../components/rate";
import Button from "antd/es/button";
import {getOperatorStatistics, getProfile, getStatistics, getSupervisorStatistics} from "../../actions/userActions";
import Spin from "antd/es/spin";
import {Map, Circle, YMaps} from "react-yandex-maps";

class Main extends Component{
    constructor(){
        super();
        this.state = {
            loading: false,
            users: [
                // {type:"user",text:"Все пользователи", amount: this.props.users ? this.props.users.usersCount : ''},
                // {type:"star",text:"Администраторы", amount: 1},
                // {type:"minus-circle",text:"Супервайзеры", amount: 1},
                // {type:"minus-circle",text:"Операторы", amount: 6146},
                // {type:"up-circle", text:"Услугодатели", amount: 6573},
                // {type:"check-circle", text:"Наблюдатели", amount: 0},

            ],
        }
    }

     handleMenuClick=e=> {
        console.log('click', e);
    };
    componentDidMount() {
        this.props.getProfile();
        const roleName = localStorage.role;
        if (roleName === 'supervisor') {
            this.props.getSupervisorStatistics(this.handleError, this.handleLoading);
        } else if (roleName === 'superadmin' || roleName === 'admin') {
            this.props.getStatistics(this.handleError, this.handleLoading);
        } else if (roleName === 'operator') {
            this.props.getOperatorStatistics(this.handleError, this.handleLoading);
        }
    }
    handleError = () => {
        this.setState({
            loading: true,
        })
    }
    handleLoading = () => {
        this.setState({
            loading: false
        })
    }
    render() {
    localStorage.setItem('organizationId', this.props.user.profile.organization ? this.props.user.profile.organization._id : '');
    const {profile} = this.props.user;
    const {statistics} = this.props.user;
    let mapChart = '';
    let roleName = '';
    if (localStorage.role === 'superadmin') {
        roleName = 'Супер Администратор'
    } else if (localStorage.role === 'admin') {
        roleName = 'Администратор'
    } else if (localStorage.role === 'supervisor') {
        roleName = 'Супервайзер'
    } else if (localStorage.role === 'operator') {
        roleName = 'Оператор'
    }
    let menuItems = '';
    const role = localStorage.role;
    if (role === 'superadmin') {
        menuItems = <Menu style={{textAlign:'left'}}  onClick={this.handleMenuClick}>
            <Menu.Item  key="1" style={{borderBottom:'1px solid #e7e7e7'}}>
                <Link to={'/dashboard'}>
                    <Icon type="home" />
                    <span className="span-text">Главная</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="2" style={{borderBottom:'1px solid #e7e7e7'}}>
                <Link to={'/dashboard/organizations/add'}>
                    <Icon type="shop" />
                    <span className="span-text">Организации</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="3" style={{borderBottom:'1px solid #e7e7e7'}}>
                <Link to={'/dashboard/admin/add'}>
                    <Icon type="star" />
                    <span className="span-text">Администраторы</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="4" style={{borderBottom:'1px solid #e7e7e7'}}>
                <Link to={'/dashboard/supervisor/add'}>
                    <Icon type="minus-circle" />
                    <span className="span-text">Супервайзеры</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="5" style={{borderBottom:'1px solid #e7e7e7'}}>
                <Link to={'/dashboard/operator/add'}>
                    <Icon type="up-circle" />
                    <span className="span-text">Операторы</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="6" style={{borderBottom:'1px solid #e7e7e7'}}>
                <Link to={'/dashboard/observer'}>
                    <Icon type="check-circle" />
                    <span className="span-text">Наблюдатели</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="7" style={{borderBottom:'1px solid #e7e7e7'}}>
                <Link to={'/dashboard/provider/add'}>
                    <Icon type="check-circle" />
                    <span className="span-text">Услугодатели</span>
                </Link>
            </Menu.Item>
        </Menu>
    } else if (localStorage.role === 'admin') {
        menuItems = <Menu style={{textAlign:'left'}}  onClick={this.handleMenuClick}>
            <Menu.Item  key="1" style={{borderBottom:'1px solid #e7e7e7'}}>
                <Link to={'/dashboard'}>
                    <Icon type="home" />
                    <span className="span-text">Главная</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="2" style={{borderBottom:'1px solid #e7e7e7'}}>
                <Link to={'/dashboard/supervisor/add'}>
                    <Icon type="minus-circle" />
                    <span className="span-text">Супервайзеры</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="3" style={{borderBottom:'1px solid #e7e7e7'}}>
                <Link to={'/dashboard/operator/add'}>
                    <Icon type="up-circle" />
                    <span className="span-text">Операторы</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="4" style={{borderBottom:'1px solid #e7e7e7'}}>
                <Link to={'/dashboard/provider/add'}>
                    <Icon type="check-circle" />
                    <span className="span-text">Услугодатели</span>
                </Link>
            </Menu.Item>
        </Menu>
    } else if (role === 'supervisor' || role === 'operator') {
        menuItems = ''
    }

    const menu = menuItems
    let dropdownMenu = ''
        if (menu === '') {
            dropdownMenu = ''
        } else {
          dropdownMenu =  <Dropdown   overlay={menu} >
                <Button type="primary">
                    <Icon type="plus-circle"/>Добавить
                    <Divider type={"vertical"}/>
                    <Icon type="down" />
                </Button>
            </Dropdown>
        }
        let  reviewByRegions = '',regions = ''
        const coordValues = [
            {
                coordinates: [53.12, 63.37],
                value: 81
            },
            {
                coordinates: [52.17, 76.58],
                value: 49
            },
            {
                coordinates: [51.08, 71.26],
                value: 34
            },
            {
                coordinates: [49.49, 73.09],
                value: 31
            },
            {
                coordinates: [42.17,69.35],
                value: 28
            },

        ];
        let mapValues = [];
        if (statistics.totalReviewsByRegions) {
            mapValues = statistics.totalReviewsByRegions.map((item, i) => {
                return item
            })
        }
        const circles = mapValues.map((item, i) => (
            <Circle
                key={i}
                geometry={[item.coordinates, item.totalReviews < 100 ? 900 * item.totalReviews : item.totalReviews > 1000 ? 20 * item.totalReviews : 40*item.totalReviews]}
                options={{
                    hasHint: true,
                    draggable: true,
                    fillColor: '#DB709377',
                    strokeColor: '#990066',
                    strokeOpacity: 0.8,
                    strokeWidth: 2,
                }}
            />
        ))
        if(statistics.totalReviewsByRegions) {
            reviewByRegions = statistics.totalReviewsByRegions.map((item, i) => (
                <div className="review-item" key={i}>
                    <span>{item.nameRu}</span> -
                    <span>{item.totalReviews}</span>
                </div>
            ))
        }
        if(statistics.serviceProvidersByRegion) {
            regions = statistics.serviceProvidersByRegion.map((item, i) => (
                <div className="bar-elements" key={i}>
                    <p style={{ width: "300px"}}>{item._id.nameRu}</p>
                    <div style={{ width: "100%"}}>
                      <div style={{width: item.total/10+'%'}} className="bar-item"/>
                    </div>
                    <p style={{paddingLeft: "10px"}}>{item.total}</p>
                </div>
            ))
        }
        let users = '';
        if (localStorage.role === 'operator' ) {
          mapChart = '';
          users =   <Row gutter={16} className="users">
              <Col span={4}>
                  <h4 className='h4-title'>{statistics.usersCountByRole && statistics.usersCountByRole.usersCount ? statistics.usersCountByRole.usersCount : 0}</h4>
                  <Icon type="user"/>
                  <span className="span-text" >Все пользователи</span>
              </Col>
              <Col span={4}>
                  <h4 className='h4-title'>{statistics.usersCountByRole && statistics.usersCountByRole.contactPersonsCount ? statistics.usersCountByRole.contactPersonsCount : 0}</h4>
                  <Icon type="plus-circle"/>
                  <span className="span-text" >Операторы</span>
              </Col>
              <Col span={4}>
                  <h4 className='h4-title'>0</h4>
                  <Icon type="check-circle"/>
                  <span className="span-text" >Наблюдатели</span>
              </Col>
          </Row>
        }  else {
            users =  <Row gutter={16} className="users">
                <Col span={4}>
                    <h4 className='h4-title'>{statistics.usersCountByRole && statistics.usersCountByRole.usersCount ? statistics.usersCountByRole.usersCount : 0}</h4>
                    <Icon type="user"/>
                    <span className="span-text" >Все пользователи</span>
                </Col>
                <Col span={4}>
                    <h4 className='h4-title'>{statistics.usersCountByRole && statistics.usersCountByRole.adminsCount ? statistics.usersCountByRole.adminsCount : 0}</h4>
                    <Icon type="star"/>
                    <span className="span-text" >Администраторы</span>
                </Col>
                <Col span={4}>
                    <h4 className='h4-title'>{statistics.usersCountByRole &&statistics.usersCountByRole.supervisorCount ? statistics.usersCountByRole.supervisorCount : 0}</h4>
                    <Icon type="minus-circle"/>
                    <span className="span-text" >Супервайзеры</span>
                </Col>
                <Col span={4}>
                    <h4 className='h4-title'>{statistics.usersCountByRole && statistics.usersCountByRole.contactPersonsCount ? statistics.usersCountByRole.contactPersonsCount : 0}</h4>
                    <Icon type="plus-circle"/>
                    <span className="span-text" >Операторы</span>
                </Col>
                <Col span={4}>
                    <h4 className='h4-title'>{statistics.serviceProvidersCount  ? statistics.serviceProvidersCount : 0}</h4>
                    <Icon type="up-circle"/>
                    <span className="span-text" >Услугодатели</span>
                </Col>
                <Col span={4}>
                    <h4 className='h4-title'>0</h4>
                    <Icon type="check-circle"/>
                    <span className="span-text" >Наблюдатели</span>
                </Col>
            </Row>
          mapChart =   <div className="count-inner">
                <div className="count-map">
                    <p className="title-text">Статистика жалоб по регионам</p>
                    <YMaps>
                        <Map defaultState={{ center: [48, 68], zoom: 4 }} id="map">
                            {circles}
                        </Map>
                    </YMaps>
                    <div className="review-by-regions">
                        {reviewByRegions}
                    </div>
                </div>
                <div className="count-region">
                    <p className="title-text">Количество учереждений по регионам</p>
                    {regions}
                </div>
            </div>
        }
        return (
            <Spin spinning={this.state.loading}>
            <div className="main">

                    <div className="container">
                        <div className="main-inner">
                            <div className="main-user">
                                <div className="main-user--info">
                                    <h1>Добро пожаловать, {profile.name}!</h1>
                                    <p>Вы вошли как <b>{roleName}</b> RateGov</p>
                                </div>
                                {dropdownMenu}
                            </div>
                            <div className="users-content">
                                <p className="title-text">Пользователи</p>
                                {/*<User users={statistics.usersCountByRole}/>*/}
                                {users}
                            </div>
                            <div className='statistics'>
                                <div className="complain-items">
                                    <p className="title-text">Жалобы</p>
                                    <p className="title-text rate-text">Рейтинг</p>
                                </div>
                                <div className="rate-items">
                                    <Row gutter={16} className="users">
                                        <Col  span={4}  className="rate-item">
                                            <h4 className='h4-title'>{statistics.reviewsCount ? statistics.reviewsCount.all : 0}</h4>
                                            <Icon type="file-text"/>
                                            <span className="span-text" >Все жалобы</span>
                                        </Col>
                                        <Col  span={4}  className="rate-item">
                                            <h4 className='h4-title'>{statistics.reviewsCount ? statistics.reviewsCount.resolved : 0}</h4>
                                            <Icon type="file-done"/>
                                            <span className="span-text" >Обработанные</span>
                                        </Col>
                                        <Col  span={4}  className="rate-item">
                                            <h4 className='h4-title'>{statistics.reviewsCount ? statistics.reviewsCount.inProcess : 0}</h4>
                                            <Icon type="file-sync"/>
                                            <span className="span-text" >В процессе</span>
                                        </Col>
                                        <Col  span={8}  className="rate-item">
                                            <h4 className='h4-title'>{statistics.avgRate ? Math.round(statistics.avgRate) : 0}</h4>
                                            <Icon type="star"/>
                                            <span className="span-text" >Общий рейтинг</span>
                                        </Col>
                                    </Row>
                                </div>
                                {mapChart}
                            </div>
                        </div>
                    </div>
                 </div>
            </Spin>
        )
}}

const mapStateToProps=(state)=>({
    user: state.user,
    auth: state.auth,
});
export  default connect(mapStateToProps, {getStatistics, getProfile, getSupervisorStatistics, getOperatorStatistics}) (withRouter(Main));