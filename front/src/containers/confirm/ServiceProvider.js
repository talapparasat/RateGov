import React,{Component} from 'react';
import {Link} from "react-router-dom";
import {Button, Form, Icon} from "antd";
import "./confirm.css"
import {connect} from 'react-redux'

import Modal from "antd/es/modal";
import {IP} from "../../actions/types";
import {getProviderConfirm} from "../../actions/serviceProviderActions";
import Spin from "antd/es/spin";
class ServiceProvider extends Component{
    constructor(){
        super();
        this.state={
            loading: false,
        }
    }
    onNext=()=>{
        this.props.history.push('/dashboard/provider');
        localStorage.removeItem('serviceProvider');
    };
    onPrev=()=>{
        this.props.history.push('/dashboard/provider/operator/connect')
    };
    handleCancel=()=>{
        this.setState({
            visible:false,
        })
    }
    handleOkClose=()=>{
        this.props.history.push('/dashboard/provider');
        localStorage.removeItem('serviceProvider');
    }
    componentDidMount() {
        let id = localStorage.getItem('serviceProvider')
        if(id){
            this.props.getProviderConfirm(id, this.handleError, this.handleLoading);
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
    handleClose=()=>{
        this.setState({
            visible:true,
        })
    }
    render() {

        const {visible}=this.state;
        const {confirm}=this.props.user;
        let admin='', supervisor = ''
        if(confirm && confirm.operators) {
            admin  = confirm.operators.map((item, i) => (
                <div style={{borderBottom:"1px solid #e7e7e7"}} key ={i}>
                    <span className="title-text">ФИО</span>
                    <h5  className="title-p">{item.name}</h5>
                    <span className="title-text">Должность</span>
                    <h5 className="title-p">{item.position}</h5>
                    <span className="title-text">Рабочий телефон</span>
                    <h5  className="title-p">{`${item.phone.work ? item.phone.work : 'Неизвестно'} внутренний: ${item.phone.inner ? item.phone.inner : 'Неизвестно'}`}</h5>
                    <span className="title-text">Мобильный телефон</span>
                    <h5 className="title-p">{item.phone.mobile && item.phone.mobile.length > 0 ? item.phone.mobile[0] : 'Неизвестно'}</h5>
                    <span className="title-text">Электронная почта</span>
                    <h5 className="title-p">{item.email}</h5>
                </div>
            ))
        }
        else{
            admin=''
        }
        if(confirm && confirm.supervisor) {
            supervisor  =
                <div className="main-info">
                    <div className="main-info--title">
                        <p>Супервайзер</p>
                        <Link to={'/dashboard/provider/connect'}><Button style={{border:"none",outline:"none"}}><Icon type="edit"/>Редактировать</Button></Link>
                    </div>
                <div>
                <img className="avatar-default" src={confirm.supervisor ? IP+confirm.supervisor.image : ''} alt="qwe"/>
                <br/>
                <span className="title-text">ФИО</span>
                <h5  className="title-p">{confirm.supervisor.name}</h5>
                <span className="title-text">Должность</span>
                <h5 className="title-p">{confirm.supervisor.position}</h5>
                <span className="title-text">Рабочий телефон</span>
                <h5  className="title-p">{  confirm.supervisor && confirm.supervisor.phone.work ? confirm.supervisor.phone.work.substring(0,2)+' ('+confirm.supervisor.phone.work.substring(2,6)+') '+confirm.supervisor.phone.work.substring(6) + ' внутренний: '+ `${ confirm.supervisor.phone.inner}`: ''}</h5>
                <span className="title-text">Мобильный телефон</span>
                <h5 className="title-p">{confirm.supervisor.phone.mobile && confirm.supervisor.phone.mobile.length > 0  ? confirm.supervisor.phone.mobile[0] : 'Неизвестно'}</h5>
                <span className="title-text">Электронная почта</span>
                <h5 className="title-p">{confirm.supervisor.email}</h5>
            </div>
                </div>
        }
        else{
            supervisor=''
        }
        return (
            <div className="organization">
                <Spin spinning={this.state.loading}>
                    <p style={{border:"none",outline:"none",cursor:"pointer"}} onClick={this.handleClose} className="organization-main">
                        <Icon className="title-p" type="close-circle" />
                        <span className="span-text title-p">Закрыть</span>
                    </p>
                    <div className="container-confirm">
                        <div className="add-inner">
                            <h2 className="h5-title">Подтверждение</h2>
                            <p className="title-text">Проверьте, все ли вы правильно заполнили.</p>
                            <div className="main-info">
                                <div className="main-info--title">
                                    <p>Услугодатель</p>
                                    <Link to={'/dashboard/provider/add'}><Button style={{border:"none",outline:"none"}}><Icon type="edit"/>Редактировать</Button></Link>
                                </div>
                                <div>
                                    <img className="avatar-default" src={confirm.serviceProvider ? IP+confirm.serviceProvider.image : ''} alt="qwe"/>
                                    <br/>
                                    <span className="title-text">ФИО</span>
                                    <h5  className="title-p">{ confirm.serviceProvider ? confirm.serviceProvider.nameRu : ''}</h5>
                                    <span className="title-text">ФИО</span>
                                    <h5  className="title-p">{ confirm.serviceProvider ? confirm.serviceProvider.nameKz : ''}</h5>
                                    <span className="title-text">Адрес</span>
                                    <h5 className="title-p">{confirm.serviceProvider ? confirm.serviceProvider.address : ''}</h5>
                                    <span className="title-text">Информация</span>
                                    <h5 className="title-p">{confirm.serviceProvider ? confirm.serviceProvider.info : ''}</h5>
                                </div>
                            </div>
                            <div className="main-info">
                                <div className="main-info--title">
                                    <p>Организация</p>
                                    <Link to={'/dashboard/provider/connect'}><Button style={{border:"none",outline:"none"}}><Icon type="edit"/>Редактировать</Button></Link>
                                </div>
                                <Form  style={{width:"100%"}}  layout={"vertical"}>
                                    <Form.Item>
                                        <img className="avatar-default" src={confirm.organization ? IP+confirm.organization.image :''} alt="qwe"/>
                                    </Form.Item>
                                    <Form.Item  label="Наименование организации">
                                        <h1 className="text">{confirm.organization  ? confirm.organization.nameRu : ''}</h1>
                                        <h1 className="text">{confirm.organization ? confirm.organization.nameKz : ''}</h1>
                                    </Form.Item>

                                </Form>
                            </div>

                                {supervisor}


                            <div style={{width:"100%",padding:"20px 0"}}>
                                <div className="main-info--title">
                                    <p>Операторы</p>
                                    <Link to={'/dashboard/provider/operator/connect'}><Button style={{border:"none",outline:"none"}}><Icon type="edit"/>Редактировать</Button></Link>
                                </div>
                                {admin}


                            </div>
                        </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",padding:"80px 0"}} >
                        <div>
                            <Button onClick={this.onPrev} style={{background:"#fff",color:"#000",marginRight:"10px"}}  type="primary"><Icon type="left-circle" />Назад</Button>
                            <span>Шаг 3. Прикрепить оператора</span>
                        </div>
                        <Button onClick={this.onNext}  type="primary">Далее<Icon type="right-circle" /></Button>
                    </div>
                    <Modal
                        title="Basic Modal"
                        visible={visible}

                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="ok" onClick={this.handleOkClose}>
                                Да
                            </Button>,

                            <Button key="no" onClick={this.handleCancel}>
                                Нет
                            </Button>,

                        ]}
                    >
                        <p>Вы уверены, что хотите остановить?</p>

                    </Modal>
                </Spin>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    user:state.user
})
export default connect(mapStateToProps,{getProviderConfirm}) (ServiceProvider);
