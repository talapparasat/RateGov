import React,{Component} from "react";
import {Button, Form, Icon, Table, message} from 'antd';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'
import Select from "antd/es/select";
import {getServiceTypesByOrganization} from "../../actions/serviceTypeActions";
import Modal from "antd/es/modal";
import {connectNavigationOrganization, getOrganizationNavigation} from "../../actions/navigationActions";
import Spin from "antd/es/spin";
const { Option } = Select;


class AddOrganization extends Component{
    constructor(){
        super();
        this.state={
            selected:false,
            organization_id:null,
            serviceProviderTypeId:null,
            visible:false,
            selectedType:'',
            selectedValues: [],
            values: [],
            navs: [],
            loading: false,
        }
    }


    // onChange=(value)=> {
    //     this.setState({
    //         service_type_id:value,
    //     })
    //     this.setState({
    //         nameKz:'',
    //         nameRu:''
    //     })
    // }


    onNext=()=>{
        this.props.history.push('/dashboard/field/add')
        this.props.navs.navs.length = 0
    };
    handleOk = () => {
        let navs = this.state.navs.map((item) => {
            return item._id
        })
        let data = {
            organizationId: this.state.organization_id,
            serviceProviderTypeId: this.state.serviceProviderTypeId,
            navs: JSON.stringify(navs)
        }
        if(navs.length > 0 && data.organizationId && data.serviceProviderTypeId){
            this.props.connectNavigationOrganization(data, this.handleError, this.handleLoading)
            this.props.navs.navs.length = 0
        }
        else {
            message.error('Выберите элементы')
        }
        this.setState({
            // selectedValues: [],
            // values: [],
            // navs: [],
            serviceProviderTypeId: null,
        })
    }

    onPrev=()=>{
        this.props.history.push('/dashboard/service-type/add');
        this.props.navs.navs.length = 0
    }
    onSelectType=(e)=>{
        console.log(e)
        this.setState({
            serviceProviderTypeId: e
        })
        this.props.getOrganizationNavigation({organizationId: this.state.organization_id, serviceProviderTypeId: e}, this.handleError, this.handleLoading)
    }

    componentDidMount() {
        let id = localStorage.getItem('organization_id');
        this.setState({
            organization_id:id
        })
        this.props.getServiceTypesByOrganization(id, this.handleError, this.handleLoading)
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
    handleClose=()=>{
        this.setState({
            visible:true,
        })
    }
    componentWillReceiveProps(props) {
        let selected = [], navs = [], navsValues = []
        if(props.navs && props.navs.navs){
            for(let i = 0; i < props.navs.navs.length; i++) {
                if (props.navs.navs[i].checked) {
                    selected.push(String(i))
                    navsValues.push(props.navs.navs[i])
                }
                if (props.navs.navs[i].navs) {
                    for (let j = 0; j < props.navs.navs[i].navs.length; j++) {
                        if(props.navs.navs[i] && props.navs.navs[i].navs[j].checked){
                            selected.push(i+'.'+j)
                            navsValues.push(props.navs.navs[i].navs[j])
                        }
                    }
                }
                navs.push(props.navs.navs[i])
            }
            this.setState({
                selectedValues: selected,
                values:  navs,
                navs: navsValues
            })
        }

    }

    onSelectTable = (record, selected) => {
        let navs = [], navsElement = []
        if(selected) {
            if(!String(record.key).includes('.')){
                let navsToAdd = this.state.values.filter((nav) => {
                    return nav._id == record._id
                })
                navsToAdd = navsToAdd[0];
                if(navsToAdd.navs.length > 0) {
                    navs.push(...this.state.selectedValues,record.key)
                    navsElement.push(...this.state.navs, record)
                    navsToAdd.navs.map((nav, i) => {
                        navs.push(record.key + '.' + i)
                        navsElement.push(nav)
                    })
                    this.setState({
                        selectedValues: navs,
                        navs: navsElement,
                    })
                } else {
                    this.state.selectedValues.push(record.key)
                    this.state.navs.push(record)
                }
            } else {
                let isPrevChecked = this.state.selectedValues.filter((key) => {
                    return record.key.split('.')[0] == key
                })
                let stateValues = this.state.values
                if (isPrevChecked.length == 0) {
                    this.state.selectedValues.push(record.key.split('.')[0])
                    for(let i = 0; i < stateValues.length; i++){
                        console.log(i,record.key.split('.')[0])
                        if(i == record.key.split('.')[0]){
                            this.state.navs.push(stateValues[i])
                        }
                    }
                }
                this.setState({
                    selectedValues: [...this.state.selectedValues, record.key],
                    navs: [...this.state.navs, record]
                })
            }
        }
        else {
            if(!String(record.key).includes('.')){
                let stayedNavs = this.state.selectedValues.filter((item) => {
                    return !item.startsWith(record.key)
                })
                let stayedNavValues = this.state.navs.filter((item) => {
                    return record._id != item.prevId && record._id != item._id
                })
                this.setState({
                    selectedValues: stayedNavs,
                    navs: stayedNavValues
                })
            }
            else {
                let count = 0, isPrevChecked = [], navs = this.state.selectedValues, stayedNavs = [];
                for(let i = 0; i < navs.length; i++) {
                    if(record.key.split('.')[0] == navs[i].split('.')[0]) {
                        count++
                    }
                }
                if(count === 2) {
                    console.log('count into')
                    isPrevChecked = this.state.selectedValues.filter((key) => {
                        return record.key.split('.')[0] != (key).split('.')[0]
                    })
                    stayedNavs = this.state.navs.filter((item) => {
                        return  record.prevId != item._id && record._id != item._id
                    })
                    this.setState({
                        selectedValues: isPrevChecked,
                        navs: stayedNavs
                    })
                }
            }}
    }
    handleLoading = () => {
        this.setState({
            loading: false
        })
    }
    handleError = () => {
        this.setState({
            loading: true,
        })
    }
    render(){
        const {visible}=this.state;
        console.log(this.state.selectedValues,this.state.navs)
        const {serviceTypesById}=this.props.serviceType;
        const {navs} = this.props;
        let optionsSelect=[];
        if(serviceTypesById && serviceTypesById.spts && serviceTypesById.spts.length>0){
            for(let i=0;i<serviceTypesById.spts.length;i++) {
                optionsSelect.push({
                    text: serviceTypesById.spts[i].nameRu,
                    value: serviceTypesById.spts[i].id
                });
            }
        }

        let options;
        if(optionsSelect && optionsSelect.length>0){
            options = optionsSelect.map((item,i)=>(
                <Option key={i} value={item.value}>{item.text}</Option>
            ))
        }
        const columns = [
            {
                title: 'Название региона на русском',
                dataIndex: 'nameRu',
                key: 'nameRu',
            },
            {
                title: 'Название региона на казахском',
                dataIndex: 'nameKz',
                key: 'nameKz',

            }
        ];
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
               this.setState({
                    selectedValues: selectedRowKeys,
                    navs: selectedRows
                })
            },
            selectedRowKeys: this.state.selectedValues,
            onSelect: this.onSelectTable,

            onSelectAll: (selected, selectedRows) => {
                this.setState({
                    navs: selectedRows
                })
            },
        };

        let  data = []
        if(navs.navs && navs.navs.length > 0){
            data = navs.navs.map((item, i) => {
                return {
                    ...item,
                    checked: item.checked,
                    children: item.navs.length > 0 ? item.navs.map((nav, j) => {
                        return {
                            ...nav,
                            key: i+ '.' +j,
                        }
                    }) : [],
                    key: String(i),
                }}
            )
        }
        return(
            <div className="organization">
                <Spin spinning={this.state.loading}>
                    `<p onClick={this.handleClose} style={{border:"none",outline:"none",cursor:"pointer"}} className="organization-main">
                        <Icon className="title-p" type="close-circle" />
                        <span className="span-text title-p">Закрыть</span>
                    </p>
                    <div className="container-nav">
                        <div className="add-inner">
                            <h2 className="h5-title">Шаг 3/7. Навигация</h2>
                            <p className="title-text">Выберите регион и район</p>
                            <Form  style={{width:"100%"}}  layout={"vertical"}>
                                <Form.Item label="Тип услугодателя ">
                                    <Select
                                        required
                                        value={this.state.serviceProviderTypeId}
                                        style={{ width: 830 }}
                                        placeholder="Выберите тип услугодателя"
                                        optionFilterProp="children"
                                        onSelect={this.onSelectType}
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {options}
                                    </Select>
                                </Form.Item>
                                <Form.Item  label="Навигация">
                                     <Table   rowSelection={rowSelection}  onChange={this.onChangePage}   columns={columns} dataSource={data} />
                                </Form.Item>
                                <Form.Item style={{display:"flex",justifyContent:"center"}}>
                                    <Button onClick={this.handleOk}  type="primary"><Icon type="plus-circle" />Связать</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end", padding:"80px 0"}} >
                        <div>
                            <Button onClick={this.onPrev} style={{background:"#fff",color:"#000",marginRight:"10px"}}  type="primary"><Icon type="left-circle" />Назад</Button>
                            <span>Шаг 2. Тип услугодателя</span>
                        </div>
                        <Button onClick={this.onNext}  type="primary">Далее<Icon type="right-circle" /></Button>
                    </div>
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
                </Spin>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({
    serviceType:state.serviceType,
    navs: state.navs,
});

export default connect(mapStateToProps,{ getServiceTypesByOrganization,  getOrganizationNavigation, connectNavigationOrganization}) (withRouter(AddOrganization));
