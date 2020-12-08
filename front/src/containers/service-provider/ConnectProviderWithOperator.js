import React,{Component} from "react";
import {Button, Form, Icon} from 'antd';
import {withRouter} from "react-router-dom";
import CheckboxGroup from "antd/es/checkbox/Group";
import Modal from "antd/es/modal";
import {connect}  from 'react-redux';
import { connectProviderWithOperator, getFreeOperators} from "../../actions/serviceProviderActions";
import Spin from "antd/es/spin";

class ProviderWithOperator extends Component{
    constructor(){
        super();
        this.state={
            visible:false,
            data:[],
            checked:true,
            editValues:[],
            loading: false,
        }
    }
    handleCancel=()=>{
        this.setState({
            visible:false,
        })
    }
    handleOkClose=()=>{
        this.props.history.push('/dashboard/provider');
        localStorage.removeItem('serviceProvider')
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
        this.props.getFreeOperators(this.handleError, this.handleLoading);
    }

    componentWillReceiveProps(props) {
        let values=[];
        if(props.user.users && props.user.users.serviceProviderOperators) {
            for (let i = 0; i <props.user.users.serviceProviderOperators.length; i++) {
                values.push(props.user.users.serviceProviderOperators[i]._id)
            }
        }
        this.setState({
            editValues:values
        })
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
    onNext=()=>{
        this.props.connectProviderWithOperator(this.handleError, this.handleLoading, this.state.editValues,this.props.history,localStorage.getItem('serviceProvider'));;
    };
        // onPrev=()=>{
        //     this.props.history.push('/dashboard/provider/connect');
        //     <a href={'/dashboard/provider/connect'}></a>
        //
        // };



    render(){

        let plainOptions=[];
        const {users} = this.props.user;
        const {editValues}=this.state;

        if(users && users.serviceProviderOperators && users.serviceProviderOperators.length>0) {
            for (let i = 0; i < users.serviceProviderOperators.length; i++) {
                plainOptions.push({value:users.serviceProviderOperators[i]._id,label:users.serviceProviderOperators[i].name});
            }
        }
        if(users && users.freeOperators && users.freeOperators.length>0) {
            for (let i = 0; i < users.freeOperators.length; i++) {
                plainOptions.push({value:users.freeOperators[i].id,label:users.freeOperators[i].name});
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
                            <h2 className="h5-title">Шаг 3/3. Выбрать оператора</h2>
                            <p className="title-text">Выберите оператора из списка или добавьте нового</p>
                            <Form  style={{width:"100%"}}  layout={"vertical"}>
                                {plainOptions.length===0 ? "В списке нету операторов" : <CheckboxGroup className="admin" options={plainOptions} style={{width:'100%'}} value={editValues} onChange={this.onChangeCheckBox}/> }

                            </Form>
                        </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",padding:"80px 0"}} >
                        <div>
                            <Button  href={'/dashboard/provider/connect'}  style={{background:"#fff",color:"#000",marginRight:"10px"}}  type="primary"><Icon type="left-circle" />Назад</Button>
                            <span>Шаг 2. Прикрепить услугодателя, организацию</span>
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
    user:state.user,
})

export default connect(mapStateToProps,{getFreeOperators,connectProviderWithOperator}) (withRouter(ProviderWithOperator));
