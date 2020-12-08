import React,{Component} from 'react';
import {Link} from "react-router-dom";
import {Button, Form, Icon} from "antd";
import "./confirm.css"
import {connect} from 'react-redux'
import Modal from "antd/es/modal";
import {IP} from "../../actions/types";
import {getConfirm} from "../../actions/userActions";
import Spin from "antd/es/spin";
class OperatorConfirm extends Component{
    constructor(){
        super();
        this.state={
            loading: false,
        }
    }
    onNext=()=>{

        this.props.history.push('/dashboard/supervisor');
        localStorage.removeItem('user');

    };
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
    onPrev=()=>{
        if(this.props.user.profile.role === "superadmin") {
            this.props.history.push('/dashboard/supervisor/connect')
        }

        else{
            this.props.history.push('/dashboard/supervisor/add')
        }
    };
    handleCancel=()=>{
        this.setState({
            visible:false,
        })
    }
    handleOkClose=()=>{
        this.props.history.push('/dashboard/supervisor');
        localStorage.removeItem('user');
    }
    componentDidMount() {
        let data ={
            id:localStorage.getItem("user"),
            text:""
        }
        this.props.getConfirm(data, this.handleError, this.handleLoading);
    }

    handleClose=()=>{
        this.setState({
            visible:true,
        })
    }
    render() {

        const {visible}=this.state;
        const {confirm}=this.props.user;

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
                                    <p>Общая информация</p>
                                    <Link to={'/dashboard/supervisor/connect'}><Button style={{border:"none",outline:"none"}}><Icon type="edit"/>Редактировать</Button></Link>
                                </div>
                                <Form  style={{width:"100%"}}  layout={"vertical"}>
                                    <Form.Item>
                                        <img className="avatar-default" src={confirm.Organization ? IP+confirm.Organization.image :''} alt="qwe"/>
                                    </Form.Item>
                                    <Form.Item  label="Наименование организации">
                                        <h1 className="text">{confirm.Organization  ? confirm.Organization.nameRu : ''}</h1>
                                        <h1 className="text">{confirm.Organization ? confirm.Organization.nameKz : ''}</h1>
                                    </Form.Item>

                                </Form>
                            </div>
                            <div className="main-info">
                                <div className="main-info--title">
                                    <p>Общая информация</p>
                                    <Link to={'/dashboard/supervisor/add'}><Button style={{border:"none",outline:"none"}}><Icon type="edit"/>Редактировать</Button></Link>
                                </div>
                                <div>
                                    <img className="avatar-default" src={confirm.User ? IP+confirm.User.image : ''} alt="qwe"/>
                                    <br/>
                                    <span className="title-text">ФИО</span>
                                    <h5  className="title-p">{ confirm.User ? confirm.User.name : ''}</h5>
                                    <span className="title-text">Должность</span>
                                    <h5 className="title-p">{ confirm.User ? confirm.User.position : ''}</h5>
                                    <span className="title-text">Рабочий телефон</span>
                                    <h5  className="title-p">{ confirm.User && confirm.User.phone.work ? confirm.User.phone.work.substring(0,2)+'('+confirm.User.phone.work.substring(2,6)+')'+confirm.User.phone.work.substring(6) + ' внутренний: '+ `${ confirm.User.phone.inner}`: ''}</h5>
                                    <span className="title-text">Мобильный телефон</span>
                                    <h5 className="title-p">{confirm.User && confirm.User.phone.mobile && confirm.User.phone.mobile.length > 0 ? confirm.User.phone.mobile[0] : 'Неизвестно'}</h5>
                                    <span className="title-text">Электронная почта</span>
                                    <h5 className="title-p">{confirm.User ? confirm.User.email : ''}</h5>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",padding:"80px 0"}} >
                        <div>
                            <Button onClick={this.onPrev} style={{background:"#fff",color:"#000",marginRight:"10px"}}  type="primary"><Icon type="left-circle" />Назад</Button>
                            <span>Шаг 2. Привязать к организации</span>
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
export default connect(mapStateToProps,{getConfirm}) (OperatorConfirm);
