import React,{Component} from "react";
import {Button, Form, Input, Icon, Row, Col, message, Upload} from 'antd';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'
import MaskedInput from "antd-mask-input";
import Modal from "antd/es/modal";
import './admin.css'
import {addUser, getUserById, saveUser} from "../../actions/userActions";
import {IP} from "../../actions/types";
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
class AddAdminSelf extends Component{
    constructor(){
        super();
        this.state={
            img: '',
            workCode: "",
            mobileCode: "",
            mobilePhone: "",
            workPhone: "",
            inner: "",
            workPhoneAll: "",
            name: "",
            position: "",
            email: "",
            visible: false,
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
            phone:{work:"+7"+this.state.workCode+this.state.workPhone,inner:this.state.inner,mobile: ["8 "+this.state.mobileCode+'-'+this.state.mobilePhone]},
            email: this.state.email,
            position:this.state.position,
            id:localStorage.getItem('organization_id'),
            path:'/dashboard/admin/connect'
        }
        if(this.props.admin.admin[0] && (this.state.img === this.props.admin.admin[0].image)){
            data.image = null
        }
        else{
            data.image=this.state.img
        }
        let id = localStorage.getItem("user")
        if (  this.state.name  && this.state.email && this.state.position) {
            this.props.saveUser(data, this.props.history, id, this.handleError, this.handleLoading);
        } else {
            message.error('Заполните все поля!')
        }
    };
    handleCancel=()=>{
        this.setState({
            visible:false,
        })
    }
    handleOkClose=()=>{
        this.props.history.push('/dashboard/admin');
        localStorage.removeItem("user")
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit = e => {
        e.preventDefault();

    };
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
    componentDidMount() {
        let id = localStorage.getItem('user');
        if(id){
            this.props.getUserById(id);
        }
        else if(this.props.location.data){
            this.props.getUserById(this.props.location.data)
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
    componentWillReceiveProps(props) {
        if (props.user && props.user.user[0] && localStorage.getItem('user') === props.user.user[0]._id) {
                this.setState({
                    email: props.user.user[0].email,
                    position: props.user.user[0].position,
                    name: props.user.user[0].name,
                    imageUrl:IP+props.user.user[0].image,
                    img:props.user.user[0].image,
                    inner: props.user.user[0].phone.inner ? props.user.user[0].phone.inner : "",
                    workCode:props.user.user[0].phone.work ? props.user.user[0].phone.work.substring(2,6) : "",
                    workPhone:props.user.user[0].phone.work ? props.user.user[0].phone.work.substring(6) : "",
                    mobileCode:props.user.user[0].phone.mobile[0].substring(2,7),
                    mobilePhone:props.user.user[0].phone.mobile[0].substring(8),
                })
            } else if (props.location.data) {
                this.setState({
                    email: props.user.user[0].email,
                    position: props.user.user[0].position,
                    name: props.user.user[0].name,
                    imageUrl:IP+props.user.user[0].image,
                    img:props.user.user[0].image,
                    inner: props.user.user[0].phone.inner ? props.user.user[0].phone.inner : "",
                    workCode:props.user.user[0].phone.work ? props.user.user[0].phone.work.substring(2,6) : "",
                    workPhone:props.user.user[0].phone.work ? props.user.user[0].phone.work.substring(6) : "",
                    mobileCode:props.user.user[0].phone.mobile[0].substring(2,7),
                    mobilePhone:props.user.user[0].phone.mobile[0].substring(8),
                })
            }
            else{
                this.setState({
                    name:this.state.name,
                    img:this.state.img,
                    inner:this.state.inner,
                    workPhone:this.state.workPhone,
                    mobilePhone:this.state.mobilePhone,
                    mobileCode:this.state.mobileCode,
                    position:this.state.position,
                    workCode:this.state.workCode,
                    email:this.state.email,
                })
            }
        }
    handleChangeInput(evt) {
        const inner = (evt.target.validity.valid) ? evt.target.value : this.state.inner;
        this.setState({
            inner
        })
    }
    render(){
        const {workCode,mobileCode,workPhone,mobilePhone,email,inner,name,position}=this.state;
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
                            <h2 className="h5-title">Шаг 1/2. Добавить администратора</h2>
                            <p className="title-text">Заполните данные нового Администратора.</p>
                            <Form  onSubmit={this.handleSubmit}  style={{width:"100%"}}  layout={"vertical"}>
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
                                <Form.Item >
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
                                                    <MaskedInput mask="1111"  value={workCode}  name="workCode" onChange={this.onChange} placeholder="7272"/>
                                                </Col>
                                                <Col span={12}>
                                                    <MaskedInput mask="11-11-11" value={workPhone}  name="workPhone" onChange={this.onChange} placeholder="12-45-78"/>
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
                            </Form>
                        </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"flex-end",alignItems:"flex-end",padding:"80px 0"}} >
                        <Button onClick={this.handleOk}  type="primary">Далее<Icon type="right-circle" /></Button>
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
    admin:state.admin,
    user:state.user
});
export default connect(mapStateToProps,{saveUser,getUserById,addUser}) (withRouter(AddAdminSelf))
