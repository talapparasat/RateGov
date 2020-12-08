import React,{Component} from "react";
import {Button, Form, Input, Icon, Row, Col, Upload, message} from 'antd';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'
import MaskedInput from "antd-mask-input";
import Modal from "antd/es/modal";
import {addAdmin} from "../../actions/adminActions";
import Spin from "antd/es/spin";

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
function beforeUpload(file) {

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Размер картинки не должен превышать 2МБ!');
    }
    return  isLt2M;
}

class AddAdmin extends Component{
    constructor(){
        super();
        this.state={
            img:'',
            workCode:"",
            mobileCode:"",
            mobilePhone:"",
            workPhone:"",
            inner:"",
            workPhoneAll:"",
            name:"",
            position:"",
            email:"",
            visible:false,
            loading: false,
        }
    }

    onUpload = (img) => {
        this.setState({img: img})
    };
    handleOk=()=>{
        let data={
            image:this.state.img,
            name:this.state.name,
            role:"admin",
            position:this.state.position,
            phone:{work:"+7"+this.state.workCode+this.state.workPhone,inner:this.state.inner,mobile: ["8 "+this.state.mobileCode+')-'+this.state.mobilePhone]},
            email:this.state.email,
            id:localStorage.getItem('organization_id')
        }
        if ( this.state.name && this.state.position  && this.state.email ) {
            this.props.addAdmin(data, this.props.history, this.handleError, this.handleLoading);
        }
        else {
            message.error('Заполните все поля!')
        }
    };
    handleCancel=()=>{
        this.setState({
            visible:false,
        })
    }
    handleOkClose=()=>{ this.props.history.push('/dashboard/organizations');
        localStorage.removeItem('organization_id')

    }
    onNext=()=>{
        this.props.history.push('/dashboard/confirm');
    }
    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    onPrev=()=>{
        this.props.history.push('/dashboard/admin/choose')
    }
    handleClose=()=>{
        this.setState({
            visible:true,
        })
    }
    handleChange = info => {
        console.log(info.file.originFileObj)
        getBase64(info.file.originFileObj, imageUrl =>
            (this.setState({
                    imageUrl,
                    loading: false,
                    img:info.file.originFileObj
                })
            ))
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
    handleChangeInput(evt) {
        const inner = (evt.target.validity.valid) ? evt.target.value : this.state.inner;
        this.setState({
            inner
        })
    }
    render(){

        const {workCode,mobileCode,workPhone,mobilePhone,email,inner,name,position}=this.state;
        console.log(this.state.inner)
        const {visible}=this.state;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        return(
            <div className="organization">
                <Spin spinning={this.state.loading}>
                    <p style={{border:"none",outline:"none",cursor:"pointer"}} onClick={this.handleClose} className="organization-main">
                        <Icon className="title-p" type="close-circle" />
                        <span className="span-text title-p">Закрыть</span>
                    </p>
                    <div className="container-add">
                        <div className="add-inner">
                            <h2 className="h5-title">Шаг 8/8. Добавить администратора</h2>
                            <p className="title-text">Заполните данные нового Администратора.</p>
                            <Form   style={{width:"100%"}}  layout={"vertical"}>
                                <Form.Item label="Данные администратора">
                                    <Upload
                                        name="img"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        customRequest={()=>{}}
                                        beforeUpload={beforeUpload}
                                        onUpload={this.onUpload}
                                        onChange={this.handleChange}
                                    >
                                        {imageUrl ? <img className="avatar-default" src={imageUrl} alt="avatar" />  : uploadButton}
                                    </Upload>
                                </Form.Item>
                                <Form.Item>
                                    <Input value={name}  name="name" onChange={this.onChange}   placeholder="ФИО"/>
                                </Form.Item>
                                <Form.Item>
                                    <Input value={position}  name="position" onChange={this.onChange} placeholder="Должность"/>
                                </Form.Item>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item className="" label="Рабочий телефон">
                                            <Row gutter={12}>
                                                <Col span={5}>
                                                    <Input value={"+7"}  name=""  placeholder=""/>
                                                </Col>
                                                <Col span={7}>
                                                    <MaskedInput mask="(111)"  value={workCode}  name="workCode" onChange={this.onChange} placeholder="727"/>
                                                </Col>
                                                <Col span={12}>
                                                    <MaskedInput mask="111-111-11" value={workPhone}  name="workPhone" onChange={this.onChange} placeholder="123-456-78"/>
                                                </Col>
                                            </Row>
                                        </Form.Item>
                                    </Col>

                                    <Col span={4}>
                                        <Form.Item label="Внутренний">
                                            <Input value={inner} pattern="[0-9]*" onInput={this.handleChangeInput.bind(this)}   placeholder="123"/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Мобильный телефон">
                                        <Row gutter={12}>
                                            <Col span={5}>
                                                <Input value={"8"}  name=""  placeholder=""/>
                                            </Col>
                                            <Col span={7}>
                                                <MaskedInput mask="(111)"  value={mobileCode}  name="mobileCode" onChange={this.onChange} placeholder="(727)"/>
                                            </Col>
                                            <Col span={12}>
                                                <MaskedInput mask="111-11-11" value={mobilePhone}  name="mobilePhone" onChange={this.onChange} placeholder="123-45-67"/>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                    </Col>
                                    </Row>
                                    <Form.Item>
                                        <Input value={email} name="email" onChange={this.onChange} placeholder="Электронная почта"/>
                                    </Form.Item>
                                <Form.Item style={{display:"flex",justifyContent:"center"}} >
                                    <Button onClick={this.handleOk}  type="primary"><Icon type="plus-circle"/>Добавить администратора</Button>
                                </Form.Item>
                            </Form>
                        </div>

                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",padding:"80px 0"}} >
                        <div>
                        <Button onClick={this.onPrev} style={{background:"#fff",color:"#000",marginRight:"10px"}}  type="primary"><Icon type="left-circle" />Назад</Button>
                        <span>Шаг 8. Выбрать администратора</span>
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
    organization:state.organization
});
export default  connect(mapStateToProps,{addAdmin}) (withRouter(AddAdmin))
