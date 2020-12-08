import React,{Component} from "react";
import {Button, Form, Icon, List, message, Upload} from 'antd';
import classnames from "classnames";
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'
import AutoComplete from "antd/es/auto-complete";
import {
    getServiceType, getServiceTypesByOrganization
} from "../../actions/serviceTypeActions";

import Select from "antd/es/select";
import {
    addCategory,
    addCategoryConnect, deleteCategoryOrganization,
    getCategories,
    getCategoriesByOrganization
} from "../../actions/categoryCriteriaActions";
import Modal from "antd/es/modal";
import Spin from "antd/es/spin";

const {Option}= Select;

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
class AddCategory extends Component{
    constructor(){
        super();
        this.state = {
            nameKz: '',
            span: true,
            nameRu: '',
            selected: false,
            organization_id: null,
            service_typeId: null,
            categoryId: null,
            visible: false,
            disabled: false,
            loading: false
        }
    }
    onChange = (value) => {
        this.setState({
            service_type_id: value,
        })
        this.setState({
            nameKz:'',
            nameRu:''
        })
    }
    onChangeAuto1=(value)=> {
        console.log(value);
        this.setState({
            nameRu:value,
        });

    };
    onSelect=(value,option)=>{
        this.setState({
            selected:true,
            disabled:true,
            categoryId:this.props.categoryCriteria.categories[value]._id,
            nameKz: this.props.categoryCriteria.categories[value].nameKz,
            nameRu: this.props.categoryCriteria.categories[value].nameRu
        })
    }
    onChangeAuto2=(value)=> {
        this.setState({
            nameKz:value,
        });
    };

    onClickRus=()=>{
        this.setState({
            span: true,
            spanStyle:{}
        })
    };
    handleCancel=()=>{
        this.setState({
            visible:false,
        })
    }
    handleOkClose=()=>{
        this.props.history.push('/dashboard/organizations');
        localStorage.removeItem('organization_id')
    }
    onClickKaz=()=>{
        this.setState({
            span: false,
            spanStyle:{borderBottom: '1px dashed #999'}
        })
    };
    handleOk=e=>{
        e.preventDefault();
        let data = {
            nameKz:this.state.nameKz,
            nameRu:this.state.nameRu,
            organizationId:this.state.organization_id,
            serviceProviderTypeId:this.state.service_type_id,
            image:this.state.img
        };
        let dataConnect = {
            organizationId: this.state.organization_id,
            categoryId: this.state.categoryId,
            serviceProviderTypeId: this.state.service_type_id,
        };
        if (this.state.selected && this.state.categoryId && this.state.service_type_id) {
            this.props.addCategoryConnect(dataConnect, this.handleError, this.handleLoading);
        } else if (this.state.nameKz && this.state.nameRu && this.state.service_type_id) {
            this.props.addCategory(data, this.handleError, this.handleLoading);
        }
        this.setState({
            nameKz:"",
            nameRu:"",
            selected:false,
            img:null,
            imageUrl:null,
            disabled:false
        })
        this.props.getCategories({query:'', lang:'ru', service_type_id: this.state.service_type_id});
        this.props.getCategories({query: '', lang:'kz', service_type_id: this.state.service_type_id})
    };
    handleDelete=(value,serviceTypeId)=>{
        this.props.deleteCategoryOrganization({organizationId:localStorage.getItem('organization_id'),categoryId:value,serviceProviderTypeId:serviceTypeId}, this.handleError, this.handleLoading);
    };
    onPrev=()=>{
        this.props.history.push('/dashboard/service/add');
        this.props.categoryCriteria.categories=[]
    };
    onNext=()=>{
        this.props.history.push('/dashboard/criteria/add');
        this.props.categoryCriteria.categories=[]
    }
    onSelectType=(e)=>{
        this.props.getCategories({query:'', lang:'ru',service_type_id:e});
        this.props.getCategories({query: '', lang:'kz',service_type_id:e})
    }
    handleSearch1 = value => {
        this.props.getCategories({query: value, lang:'ru',service_type_id:this.state.service_type_id});
    };
    handleSearch2 = value => {
        this.props.getCategories({query: value, lang:'kz',service_type_id:this.state.service_type_id});
    };

    componentDidMount() {
        let id = localStorage.getItem('organization_id');
        this.setState({
            organization_id:id,

        });

        this.props.getServiceTypesByOrganization(id, this.handleError, this.handleLoading);
        this.props.getCategoriesByOrganization(id);
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
    resetInput=()=>{
        this.setState({
            nameRu:'',
            nameKz:'',
            disabled:false,
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

    render(){
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        const {span,nameKz,nameRu,visible,disabled}=this.state;
        const {categoriesAll,categories}=this.props.categoryCriteria;
        const {serviceTypesById}= this.props.serviceType;
        let dataRu = [];
        let dataKz = [];
        let optionsSelect=[];
        let listRu=[];
        let listKz=[];

        if(serviceTypesById && serviceTypesById.spts &&  serviceTypesById.spts.length>0){
            for(let i = 0; i < serviceTypesById.spts.length; i++) {
                optionsSelect.push({
                    text: serviceTypesById.spts[i].nameRu,
                    value: serviceTypesById.spts[i].id
                })
            }
        }
        if(categories && categories.length>0){
            for(let i=0;i<categories.length;i++) {
                if (categories[i]) {
                    dataRu.push({
                        text: categories[i].nameRu,
                        value: i
                    })
                    dataKz.push({
                        text: categories[i].nameRu,
                        value: i
                    })
                }
            }
        }

        if(categoriesAll && categoriesAll.length>0){
            for (let i = 0; i < categoriesAll.length; i++) {
                listRu.push({text: categoriesAll[i].serviceProviderType.nameRu, value: categoriesAll[i].serviceProviderType._id,id:"serviceType",});
                listKz.push({text: categoriesAll[i].serviceProviderType.nameKz, value: categoriesAll[i].serviceProviderType._id,id:"serviceType"});

                for(let j=0;j<categoriesAll[i].categories.length;j++) {
                    listRu.push({text: categoriesAll[i].categories[j].nameRu, value: i,id:categoriesAll[i].categories[j].id,serviceTypeId:categoriesAll[i].serviceProviderType._id});
                    listKz.push({text: categoriesAll[i].categories[j].nameKz, value: i,id:categoriesAll[i].categories[j].id,serviceTypeId:categoriesAll[i].serviceProviderType._id});
                }
            }
        }
    let options;
        if(optionsSelect && optionsSelect.length>0){
            options = optionsSelect.map((item,i)=>(
                <Option key={i} value={item.value}>{item.text}</Option>
            ))
        }
        return(
            <div className="organization">
                <Spin spinning={this.state.loading}>
                    <p style={{border:"none",outline:"none",cursor:"pointer"}} onClick={this.handleClose} className="organization-main">
                        <Icon className="title-p" type="close-circle" />
                        <span className="span-text title-p">Закрыть</span>
                    </p>
                    <div className="container-add">
                        <div className="add-inner">
                            <h2 className="h5-title">Шаг 6/8. Категорий оценок</h2>
                            <p className="title-text">Пожалуйста, введите категорий оценок  данной организации</p>
                            <Form  style={{width:"100%"}}  layout={"vertical"}>
                                <Form.Item label="Тип услуги ">
                                    <Select
                                        showSearch
                                        style={{ width: 600 }}
                                        placeholder="Выберите тип услуги"
                                        optionFilterProp="children"
                                        onChange={this.onChange}
                                        onSelect={this.onSelectType}
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {options}
                                    </Select>
                                </Form.Item>
                                <div style={{display:"flex"}}>
                                    <Form.Item label="Категория оценок ">
                                        <div style={ disabled ? { background:"#f5f5f5"} : { background:"#fff"} }>
                                            <AutoComplete
                                                disabled={disabled}
                                                value={nameRu}
                                                style={{ width: 600 }}
                                                onSelect={this.onSelect}
                                                onChange={this.onChangeAuto1}
                                                onSearch={this.handleSearch1}
                                                dataSource={dataRu}
                                                placeholder="Введите на русском"
                                                filterOption={(inputValue, option) =>
                                                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                                }
                                            />
                                        </div>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button style={{marginTop:"25px",marginLeft:"10px",border:"none",outline:"none"}}  onClick={this.resetInput}><Icon type="close"/></Button>
                                    </Form.Item>
                                </div>
                                <Form.Item>
                                    <div style={ disabled ? { background:"#f5f5f5"} : { background:"#fff"} }>
                                        <AutoComplete
                                            disabled={disabled}
                                            value={nameKz}
                                            onSelect={this.onSelect}
                                            style={{ width: 600 }}
                                            onChange={this.onChangeAuto2}
                                            onSearch={this.handleSearch2}
                                            dataSource={dataKz}
                                            placeholder="Введите на казахском"
                                            filterOption={(inputValue, option) =>
                                                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                            }
                                        />
                                    </div>
                                </Form.Item>
                                <Form.Item>
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
                                <Form.Item style={{display:"flex",justifyContent:"center"}}>
                                    <Button onClick={this.handleOk}  type="primary"><Icon type="plus-circle" />Добавить категорию</Button>
                                </Form.Item>
                            </Form>
                        </div>
                        <div className="block-title">
                        <p>Добавленные категории на <span className={classnames("span", {'span-active': span})} onClick={this.onClickRus} >Русском</span>  <span className={classnames("span", {'span-active': !span})}  onClick={this.onClickKaz} >Казахском</span></p>
                            <div className="colors">
                                <div className="serviceType">
                                    <div className="service-type-color"/>
                                    <span> - Тип услуги</span>
                                </div>
                                <div className="serviceType">
                                    <div className="category-color"/>
                                    <span> - Категорий оценок</span>
                                </div>
                            </div>
                        </div>
                        <div className="list">
                            {span ? <List
                                className="list"
                                size="small"
                                bordered
                                dataSource={listRu}
                                renderItem={(item) =>
                                {
                                    return item.id === 'serviceType' ?
                                        <List.Item className="list-item-service">
                                            {item.text}
                                        </List.Item>
                                        :
                                        <List.Item className="list-item-category">
                                            {item.text}
                                            <Icon type="delete" onClick={() => this.handleDelete(item.id,item.serviceTypeId)}/>
                                        </List.Item>
                                }
                                }
                            /> : <List
                                className="list"
                                size="small"
                                bordered
                                dataSource={listKz}
                                renderItem={(item) =>  {
                                    return item.id === 'serviceType' ?
                                        <List.Item className="list-item-service">
                                            {item.text}
                                        </List.Item>
                                        :
                                        <List.Item className="list-item-category">
                                            {item.text}
                                            <Icon type="delete" onClick={() => this.handleDelete(item.id)}/>
                                        </List.Item>
                                }
                                }
                            />}
                        </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",padding:"80px 0"}} >
                        <div>
                            <Button onClick={this.onPrev} style={{background:"#fff",color:"#000",marginRight:"10px"}}  type="primary"><Icon type="left-circle" />Назад</Button>
                            <span>Шаг 5. Услуги</span>
                         </div>
                        <Button onClick={()=>this.onNext(this.state.organization_id)}  type="primary">Далее<Icon type="right-circle" /></Button>
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
    categoryCriteria:state.categoryCriteria,
    serviceType:state.serviceType,
});
export default connect(mapStateToProps,{deleteCategoryOrganization,getServiceType,addCategory,getCategoriesByOrganization,addCategoryConnect,getServiceTypesByOrganization,getCategories}) (withRouter(AddCategory));
