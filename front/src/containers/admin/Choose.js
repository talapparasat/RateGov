import React,{Component} from "react";
import {Button, Form, Icon} from 'antd';
import {withRouter} from "react-router-dom";
import './admin.css'
import CheckboxGroup from "antd/es/checkbox/Group";
import Modal from "antd/es/modal";
import {connectAdmins, getFreeAdmins} from "../../actions/adminActions";
import {connect}  from 'react-redux';
import Spin from "antd/es/spin";

class ChooseAdmin extends Component{
    constructor(){
        super();
        this.state = {
            visible: false,
            data: [],
            checked: true,
            editValues: [],
            loading: false,
        }
    }
    handleCancel=()=>{
        this.setState({
            visible:false,
        })
    }
    handleOkClose=()=>{
        this.props.history.push('/dashboard/organizations');
        localStorage.removeItem('organization_id')
    }
    onChangeCheckBox=e=> {
        this.setState({
            editValues:e
        })
    }
    handleClose=()=>{
        this.setState({
            visible:true,
        })
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    componentDidMount() {
        this.props.getFreeAdmins();
    }
    add=()=>{
        this.props.history.push('/dashboard/admin/add');
    }
    componentWillReceiveProps(props) {
        let values=[];
        if(props.admin.admins && props.admin.admins.organizationUsers) {
            for (let i = 0; i <props.admin.admins.organizationUsers.length; i++) {
                values.push(props.admin.admins.organizationUsers[i]._id)
            }
        }

        // if(props.admin.admins && props.admin.admins.freeUsers && props.admin.admins.freeUsers.length>0) {
        //     for (let i = 0; i < props.admin.admins.freeUsers.length; i++) {
        //         values.push(props.admin.admins.freeUsers[i].id);
        //     }
        // }
        this.setState({
            editValues:values
        })
    }

    onNext=()=>{
        this.props.connectAdmins(this.state.editValues,this.props.history,localStorage.getItem('organization_id'), this.handleError, this.handleLoading);
    };
    onPrev=()=>{
        this.props.history.push('/dashboard/criteria/add');
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


    render(){
        let plainOptions=[];
        const {admins} = this.props.admin;
        const {editValues}=this.state;
            if(admins && admins.organizationUsers && admins.organizationUsers.length>0) {
                for (let i = 0; i < admins.organizationUsers.length; i++) {
                    plainOptions.push({value:admins.organizationUsers[i]._id,label:admins.organizationUsers[i].name});
                }
            }
            if(admins && admins.freeUsers && admins.freeUsers.length>0) {
                for (let i = 0; i < admins.freeUsers.length; i++) {
                    plainOptions.push({value:admins.freeUsers[i].id,label:admins.freeUsers[i].name});
                }
            }
        const {visible}=this.state;

        return(
            <div className="organization">
                <Spin spinning={this.state.loading}>
                    <p style={{border:"none",outline:"none",cursor:"pointer"}} onClick={this.handleClose} className="organization-main">
                        <Icon className="title-p" type="close-circle" />
                        <span className="span-text title-p">Закрыть</span>
                    </p>
                    <div className="container-add">
                        <div className="add-inner">
                            <h2 className="h5-title">Шаг 8/8. Выбрать администратора</h2>
                            <p className="title-text">Выберите администратора из списка или добавьте нового</p>
                            <Form  style={{width:"100%"}}  layout={"vertical"}>
                                {plainOptions.length>0 ? <CheckboxGroup className="admin" options={plainOptions}  style={{width:'100%'}} value={editValues} onChange={this.onChangeCheckBox}/> : <p align="center">В списке еще нету администраторов</p>}
                                <Form.Item style={{display:"flex",justifyContent:"center"}}>
                                    <Button onClick={this.add}  type="primary"><Icon type="plus-circle" />Добавить администратора</Button>
                                </Form.Item>
                            </Form>
                        </div>
                     </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",padding:"80px 0"}} >
                        <div>
                        <Button onClick={this.onPrev} style={{background:"#fff",color:"#000",marginRight:"10px"}}  type="primary"><Icon type="left-circle" />Назад</Button>
                        <span>Шаг 7. Критерий оценок</span>
                        </div>
                        <Button onClick={this.onNext}  type="primary">Далее<Icon type="right-circle" /></Button>
                        <Modal
                            title="Предупреждение"
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
                    </div>
                </Spin>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    admin:state.admin
})

export default connect(mapStateToProps,{getFreeAdmins,connectAdmins}) (withRouter(ChooseAdmin));
