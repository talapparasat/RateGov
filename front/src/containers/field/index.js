import React, { Component } from 'react'
import {Table, Divider, Button, Icon, Input, Form, message} from 'antd';
import {connect} from 'react-redux';
import Common from "../../components/common";
import {addField, deleteField, getFields, updateField} from "../../actions/fieldActions";
import Modal from "antd/es/modal";
import Switch from "antd/es/switch";
import Spin from "antd/es/spin";

class Field extends Component {
    constructor(){
        super();
        this.state={
            page: 1,
            query: "",
            visible: false,
            editvisible: false,
            labelRu: "",
            labelKz:"",
            name: "",
            required: false,
            type: "",
            editLabelRu:"",
            editLabelKz:"",
            editId: null,
            editType: '',
            deleteVisible: false,
            id: null,
            deleteId: null,
            editName: '',
            loading: false,
        }
    }
    openDeleteModal = id => {
        this.setState({
            deleteVisible:true,
            deleteId:id
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
    onChange=(e)=> {
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    componentDidMount() {
        this.props.getFields({query: '', page: 1}, this.handleLoading, this.handleError)
    }
    openModal=()=>{
        this.setState({
            visible:true,
            nameRu:'',
            nameKz:''
        })
    }
    handleCancel=()=>{
        this.setState({
            visible:false
        })
    }
    openEditModal = record => {
        this.setState({
            editvisible: true,
            editLabelRu: record.labelRu,
            editLabelKz: record.labelKz,
            editId: record._id,
            required: record. required,
            editType: record.type,
            editName: record.name,
        })
    }
    handleEditCancel=()=>{
        this.setState({
            editvisible:false
        })
    }

    handleDelete = () => {
        if(this.state.deleteId){
            this.props.deleteField(this.state.deleteId, this.handleDeleteCancel, this.handleError, this.handleLoading)
        }

    }
    handleEditOk = ()=>{
        let data ={
            labelRu:this.state.editLabelRu,
            labelKz:this.state.editLabelKz,
            required: this.state.required,
            name: this.state.editName,
            type: this.state.editType
        }
        this.props.updateField(this.state.editId, data, this.handleEditCancel,this.handleError, this.handleLoading)
    }
    handleDeleteCancel = () => {
        this.setState({
            deleteVisible: false
        })
    };
    handleOk=()=>{
        let data ={
            labelRu:this.state.labelRu,
            labelKz:this.state.labelKz,
            required: this.state.required,
            name: this.state.name,
            type: this.state.type
        };
        if (this.state.labelRu.length > 0 && this.state.labelKz.length > 0 &&  this.state.name.length > 0) {
            this.props.addField(data, this.handleCancel, this.handleError, this.handleLoading)
        } else {
            message.error('Заполните нужные поля!')
        }
    }
    onChangeSwitch = e => {
        this.setState({
            required: e
        })
    }
    onKeyUp=(e)=> {
        this.setState({
            query:e.target.value,
            page:1
        })
        this.props.getFields({query: e.target.value, page: this.state.page}, this.handleLoading, this.handleError);
    }

    onChangePage=(page,pageSize)=>{
        console.log(page)
        this.setState({
            page:page.current
        })
        this.props.getFields({query: this.state.query, page: page.current}, this.handleLoading, this.handleError);
    }
    render() {
        const {visible,editvisible,editLabelRu,editLabelKz,labelRu,labelKz, name, type, required, deleteVisible, editName, editType}=this.state;
        let actionColumn={},addButton='';
        const {user} = this.props
        const {fields} = this.props.field
        if(user.profile.role === "superadmin" || user.profile.role==="admin"){
            actionColumn =   {
                title: 'Действия',
                key: 'action',
                render: (text, record) => (
                    <span>
        <Button type="link" onClick={() => this.openEditModal(record)}><Icon type="edit"/>Редактировать</Button>
        <Divider type="vertical"/>
        <Button type="link" onClick={() => this.openDeleteModal(record._id)}> <Icon type="delete"/>Удалить</Button>
      </span>
                ),
            }
            addButton=<Button onClick={this.openModal} type="primary"><Icon type="plus-circle"/>Добавить поле</Button>
        }

        const columns = [
            {
                title: 'label на русском',
                dataIndex: 'labelRu',
                key: 'nameRu',
            },
            {
                title: 'label на казахском',
                dataIndex: 'labelKz',
                key: 'nameKz',

            },
            {
                title: 'Название',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Тип',
                dataIndex: 'type',
                key: 'type',

            },
            actionColumn
        ];

        let  data = []
        if(fields.fields && fields.fields.length > 0) {
            data = fields.fields.map((item, i) => {
                return {
                    ...item,
                    key: i,
                }
            })
        }



        return(
            <div className="organization">
                <Spin spinning={this.state.loading}>
                    <div className="container">
                        <div className="org-title">
                            <div className='org-text'>
                                <h5 className="h5-title">Дополнительные поля</h5>
                                <p className="title-text">Список полей который был добавлен в систему</p>
                                <Input  onKeyUp={this.onKeyUp} name="query" style={{margin:"15px 0"}} placeholder="Введите русское название поля" prefix={<Icon type="search"/>}/>
                            </div>
                            <div className="org-link" >
                                {addButton}
                            </div>
                        </div>
                        {/* {data.length===0 ? <Common/> : <Table pagination={{total:fields.fields ? fields.fields.total : 0,pageSize: fields.fields ? fields.fields.pageSize : 0,current:this.state.page}} onChange={this.onChangePage}    columns={columns} dataSource={data} />} */}
                    </div>
                    {/* <Modal
                        visible={visible}
                        title="Добавить поле"
                        onCancel={this.handleCancel}
                        closeIcon={<div className="organization-main"><Icon style={{color: "#212121"}}
                                                                            type="close-circle"/><span
                            style={{paddingRight: "20px"}} className="span-text title-p">Закрыть</span></div>}
                        footer={[
                            <Button key="edit" onClick={this.handleOk}>
                                Сохранить
                            </Button>,
                            <Button key="back" onClick={this.handleCancel}>
                                Отменить
                            </Button>,

                        ]}
                    >
                        <Form layout={"vertical"}>
                            <Form.Item label="Метка на русском">
                                <Input value={labelRu} name="labelRu" onChange={this.onChange} placeholder="Введите на русском"/>
                            </Form.Item>
                            <Form.Item label="Метка на казахском">
                                <Input value={labelKz} name="labelKz" onChange={this.onChange} placeholder="Введите на казахском"/>
                            </Form.Item>
                            <Form.Item label="Название">
                                <Input value={name} name="name" onChange={this.onChange} placeholder="Имя"/>
                            </Form.Item>
                            <Form.Item label="Тип">
                                <Input value={type} name="type" onChange={this.onChange} placeholder="Тип"/>
                            </Form.Item>
                            <Form.Item label="Обязательное поле">
                                <Switch  onChange={this.onChangeSwitch} />
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Modal
                        visible={editvisible}
                        title="Редактировать поле"
                        onCancel={this.handleEditCancel}
                        closeIcon={<div className="organization-main"><Icon style={{color: "#212121"}}
                                                                            type="close-circle"/><span
                            style={{paddingRight: "20px"}} className="span-text title-p">Закрыть</span></div>}
                        footer={[
                            <Button key="edit" onClick={this.handleEditOk}>
                                Сохранить
                            </Button>,
                            <Button key="back" onClick={this.handleEditCancel}>
                                Отменить
                            </Button>,

                        ]}
                    >
                        <Form layout={"vertical"}>
                            <Form.Item label="Метка на русском">
                                <Input value={editLabelRu} name="editLabelRu" onChange={this.onChange} placeholder="Введите на русском"/>
                            </Form.Item>
                            <Form.Item label="Метка на казахском">
                                <Input value={editLabelKz} name="editLabelKz" onChange={this.onChange} placeholder="Введите на казахском"/>
                            </Form.Item>
                            <Form.Item label="Название">
                                <Input value={editName} name="editName" onChange={this.onChange} placeholder="Имя"/>
                            </Form.Item>
                            <Form.Item label="Тип">
                                <Input value={editType} name="editType" onChange={this.onChange} placeholder="Тип"/>
                            </Form.Item>
                            <Form.Item label="Обязательное поле">
                                <Switch checked={required}  onChange={this.onChangeSwitch} />
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Modal
                        title="Удалить"
                        visible={deleteVisible}
                        closeIcon={<div className="organization-main"><Icon style={{color: "#212121"}}
                                                                            type="close-circle"/><span
                            style={{paddingRight: "20px"}} className="span-text title-p">Закрыть</span></div>}
                        onCancel={this.handleDeleteCancel}
                        footer={[
                            <Button style={{background:"#000",color:"#fff"}} key="ok" onClick={()=>this.handleDelete()}>
                                <Icon type="check-circle" />Да, удалить
                            </Button>,
                            <Button key="no" onClick={this.handleDeleteCancel}>
                                <Icon type="close-circle" /> Нет, не удалять
                            </Button>,
                        ]}
                    >
                        <p>Вы уверены что хотите удалить поле?</p>
                    </Modal> */}
                </Spin>
            </div>

        )
    }
}
const mapStateToProps=(state)=>({
    user:state.user,
    field: state.field,
});

export  default connect(mapStateToProps,{getFields, addField, deleteField, updateField}) (Field);