import { Icon, Button, Divider, Table,} from 'antd';
import React, { Component } from 'react'
import {Link} from 'react-router-dom'


import {connect} from 'react-redux';
import Common from "../../components/common";



class Observer extends Component {
    state = {


    };

    render() {
        const columns = [
            {
                title: 'Фото',
                dataIndex: 'image',
                key: 'image',
                render: image => <img className="img" src={image} alt="img"/>,
            },
            {
                title: 'Наблюдатель',
                key: 'name',
                dataIndex: 'name',
            },
            {
                title: 'Наименование организаций',
                dataIndex: 'organization',
                key: 'organization',

            },

            {
                title: 'Действия',
                key: 'action',
                render: (text, record) => (
                    <span>
        <a><Icon type="edit"/>Редактировать </a>
        <Divider type="vertical" />
        <a onClick={()=>this.openDeleteModal(record.id)}> <Icon type="delete" />Удалить</a>
      </span>
                ),
            },
        ];

        const data = [
            // {
            //     key: '1',
            //     name: 'Ахметов Дарын ',
            //     image:"/assets/logo.png",
            //     organization: 'АГДСПК',
            // },

        ];


        return(
            <div className="organization">
                <div className="container">

                    <div className="org-title">
                        <div className='org-text'>
                            <h5 className="h5-title">Наблюдатели</h5>
                            <p className="title-text">Функции: добавление и управление услугами организаций</p>
                        </div>
                        <div className="org-link" >
                            <Link   to={'/dashboard/admin/add'}><Button type="primary"><Icon type="plus-circle"/>Добавить наблюдателя</Button></Link>
                        </div>
                    </div>
                    {data.length===0 ? <Common/> : <Table columns={columns} dataSource={data} />}
                </div>
            </div>
        )
    }
}
const mapStateToProps=(state)=>({

})
export  default connect(mapStateToProps) (Observer);