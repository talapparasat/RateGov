import {Layout, Icon, Button, Dropdown,} from 'antd';
import React, { Component } from 'react'
import {withRouter, Link} from 'react-router-dom'
import { notification } from 'antd';
import './dashboard.css'
import {connect} from 'react-redux';
import Footer from "../../components/footer";
import {logoutUser} from "../../actions/authActions";
import {clearCurrentProfile} from "../../actions/profileActions";
import MenuAdmin from "../../components/Menu/MenuAdmin";
import MenuSuperAdmin from "../../components/Menu/MenuSuperAdmin";
import RouteSuperAdmin from "../../components/Route/RouteSuperAdmin";
import RouteAdmin from "../../components/Route/RouteAdmin";
import {getProfile, } from "../../actions/userActions";
import {deleteNotification, getNotifications, getReviews} from "../../actions/reviewActions"
import MenuSupervisor from "../../components/Menu/MenuSupervisor";
import RouteSupervisor from "../../components/Route/RouteSupervisor";
import MenuOperator from "../../components/Menu/MenuOperator";
import RouteOperator from "../../components/Route/RouteOperator";
import {withSocketContext} from "../../components/SocketContext"
import Menu from "antd/es/menu";
import List from "antd/es/list";
import moment from "moment";
import Badge from "antd/es/badge";
import Tooltip from "antd/es/tooltip";
const { Header, Sider} = Layout;

class Dashboard extends Component {
   constructor(){
       super();
       this.state={
           response:'',
           notification: 'outlined',
           newNotification: ''
       }
   }

    onLogout=()=>{
        this.props.clearCurrentProfile();
        this.props.logoutUser( this.props.history);
    }
    openNotification = () => {
        const btn = <a href={'/dashboard/reviews/' + this.state.response._id}>
                    Перейти
                    </a>

        notification.open({
            message: 'К вам поступил новый отзыв',
            description:this.state.response ? this.state.response.text : '',
            duration: 0,
            btn
        });
    };
     componentDidMount() {
       this.props.getProfile()
       if (localStorage.role === 'supervisor' || localStorage.role === 'operator') {
           this.props.getNotifications()
       }
       // this.props.getReviews({status: "ACTIVE", page: 1, whose: "my"});
       const {socket} = this.props;
         if(socket) {
             socket.on("Review.created", data => {
                 console.log(data);
                 this.setState({response: data});
                 this.openNotification();
             })
             socket.on("notification.received", data => {
                 this.setState({
                     newNotification: data
                 })
             })
         }
      }
    onVisibleChange = e =>{
         if(e){
             this.setState({
                 notification: 'filled'
             })
         }
         else{
             this.setState({
                 notification: 'outlined'
             })
         }
    }
    deleteNotification = id => {
         console.log(id)
         if(id){
             this.props.deleteNotification(id)
         }
    }
    handleDate = date => {
         let createdAt = new Date(date)
        return `${createdAt.getDate().toString().padStart(2,'0')}.${(createdAt.getMonth()+1).toString().padStart(2,'0')}.${createdAt.getFullYear()} ${createdAt.getHours()}:${createdAt.getMinutes().toString().padStart(2,'0')}:${createdAt.getSeconds().toString().padStart(2,'0')}`
    }

    render() {
         const {profile} = this.props.user;
         const {notifications} = this.props.review
         const {notification, newNotification} = this.state;
         let data = []
         if (notifications && notifications.length > 0) {
             data = notifications.map((item, i) => {
                 return item
             })
         }
         if (newNotification) {
             data.push(newNotification)
         }
        const dropdownMenu = (
                <div style={{width:"500px",height:"400px",background:"#fff",boxShadow:'0px 0px 5px 0px rgba(51,51,51,.2)',overflowY:"auto"}}>
                    <List
                        header = {<div style={{fontWeight:600,textAlign:"center"}}>Непрочитанные отзывы</div>}
                        size="large"
                        bordered
                        dataSource={data}
                        renderItem={item => <List.Item style={{wordBreak:"break-all"}}>
                            <div style={{width:"100%"}}>
                                <b>Новый отзыв</b>
                                <p>Поступил в {item.date ? this.handleDate(item.date) : "Неизвестно"}</p>
                                <Link style={{ display: "flex", justifyContent: "flex-end", width: "100%"}} to={`/dashboard/reviews/${item.sourceId}`} onClick={() => this.deleteNotification(item._id)}>Перейти</Link>
                            </div>
                        </List.Item>}
                    />
                </div>

        );
         let showNotification = ''
         if(localStorage.role === 'operator'){
             showNotification = (<Dropdown onVisibleChange={this.onVisibleChange} trigger={['click']} overlay={dropdownMenu}>
                 <Badge count={data.length} style={{cursor:"pointer"}}>
                     <Icon type="notification" theme={notification}/>
                 </Badge>
             </Dropdown>)
         }
        let role = "";
        if(localStorage.role){
            role= localStorage.role
        }
        else if(profile && profile.role){
            role = profile.role
        }
        let locationAdd=window.location.href.substring(window.location.href.indexOf('dashboard'));;
        let key =  window.location.href.substring(32)
        let menuText = "";
        let routes = ['dashboard/organizations/add','dashboard/service-type/add','dashboard/service/add','dashboard/category/add',
            'dashboard/criteria/add','dashboard/admin/add','dashboard/admin/choose','dashboard/confirm','dashboard/admin/self',
            'dashboard/admin/organization/add','dashboard/navigation/add','dashboard/admin/confirm','dashboard/operator/confirm','dashboard/operator/add','dashboard/operator/connect',
            'dashboard/supervisor/add','dashboard/field/add','dashboard/supervisor/confirm','dashboard/supervisor/connect','dashboard/provider/add',
            'dashboard/provider/confirm','dashboard/provider/connect','dashboard/provider/operator/connect',];
        let event = {};

        for(let route in routes){
            if(routes[route] === locationAdd) {
                event = {
                    pointerEvents: "none",
                    opacity: "0.4"
                }
                break;
                } else {
                event = {}
            }
        }
        let location = window.location.href.substring(window.location.href.lastIndexOf('/'));

        if (location === '/dashboard'){
            menuText = <p style={{marginBottom:'0'}}>Главная</p>
        } else {
            menuText = <p style={{marginBottom: '0'}}/>
        }

        let menu = '',route = '';
        if (role === 'admin') {
            menu = <MenuAdmin locationKey={key}/>
            route = <RouteAdmin/>
        } else if (role === 'superadmin'){
            menu = <MenuSuperAdmin locationKey={key}/>
            route = <RouteSuperAdmin/>
        } else if (role === 'supervisor'){
            menu = <MenuSupervisor profile={profile} locationKey={key}/>
            route = <RouteSupervisor/>
        } else if (role === 'operator'){
            menu = <MenuOperator locationKey={key}/>
            route = <RouteOperator/>
        }
        return (
            <Layout>
                <Sider style={event} theme="light" trigger={null} >
                    {menu}
                    <Button style={{border:"none",margin:'80px 80px 0 0',boxShadow:'none',color:"#212121"}} onClick={this.onLogout}>
                        <Icon type="logout" />
                        <a href="/" className="span-text">Выйти</a>
                    </Button>
                    <Footer/>
                </Sider>
                <Layout>
                    <Header style={{boxSizing: 'borderBox', display:'flex',justifyContent:"space-between",alignItems:"center", background: '#e7e7e7', paddingLeft:40, textAlign:'left',fontWeight:400,color:'#000'}}>
                        {menuText}
                        <div style={{display:"flex",alignItems:'center', justifyContent: 'flex-end', height: '100%'}}>
                            {showNotification}
                                <div className="header-title">
                                    <div className="header-title--inner">
                                        <h2>{profile && profile.name ? profile.name : ""}</h2>
                                    </div>
                                    <div className="header-title--inner">
                                        <Tooltip title={profile && profile.serviceProvider ? `${profile.serviceProvider.nameRu}` : ""}>
                                            <span>{profile && profile.serviceProvider ? `${profile.serviceProvider.nameRu}` : ""}</span>
                                        </Tooltip>
                                    </div>
                                </div>

                        </div>
                    </Header>
                    {route}
                </Layout>
            </Layout>
        );
    }
}
const mapStateToProps=(state)=>({
    user: state.user,
    auth: state.auth,
    review: state.review,
});
export  default connect(mapStateToProps,{logoutUser,clearCurrentProfile,getProfile, getReviews, getNotifications, deleteNotification}) (withRouter(withSocketContext(Dashboard)));