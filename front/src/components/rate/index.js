import {Icon,Row,Col} from "antd";
import React,{Component} from "react";

class Rate extends Component{
    constructor(props) {
        super(props);
        this.state= {
            rates: [
                {type: "file-text", text: "Все жалобы", amount: 351},
                {type: "file-done", text: "Обработанные", amount: 18},
                // {type: "file-excel", text: "Проваленные"},
                {type: "file-sync", text: "В процессе", amount: 333},
                // {type: "star",text:"Общий рейтинг"},
                // {type:"check-circle",text:"Проголосовало"},
            ],
        }
    }

    render(){
        const {rates}=this.state;
        let item = rates.map((item,i)=>(
            <Col  span={4}  className="rate-item" key={i}>
                <h4 className='h4-title'>{item.amount}</h4>
                <Icon type={item.type}/>
                <span className="span-text" >{item.text}</span>
            </Col>
        ))

        return(
            <Row gutter={16} className="users">
                {item}
            </Row>
        )
    }
}
export default Rate