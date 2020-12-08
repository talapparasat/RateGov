import React, { Component } from 'react';
import {Select} from "antd";
import {ResponsiveLine} from "@nivo/line";
const { Option } = Select
class LineChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChange: false,
            visible: true,
            category: '1'
        }
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.filter !== this.props.filter && nextProps.visible) {
            this.setState({
                isChange: true
            })
        } else {
            this.setState({
                isChange: false
            })
        }

    }
    onSelect = e => {
        this.setState({
            category: e
        })
        console.log(e)
    }
    hourDiff = (startDate) => {
        const date = startDate;
        const listDate = [];
        for (let i = 0; i < 24; i++) {
            if (i < 10) {
                listDate.push(date.substring(0, date.indexOf(' ')) + ' 0' + i + ':00');
            } else {
                listDate.push(date.substring(0, date.indexOf(' ')) + ' '+ i + ':00');
            }
        }
        return listDate;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.filter !== this.props.filter) {
            this.setState({
                category: '1'
            })
        }
    }

    weekDiff = (startDate, endDate) => {
        const listDate = [];
        const startDate1 = startDate;
        const endDate1 = endDate;
        const dateMove = new Date(startDate1);
        let strDate = startDate1;

        while (strDate < endDate1){
            strDate = dateMove.toISOString().slice(0,10);
            listDate.push(strDate);
            dateMove.setDate(dateMove.getDate()+1);
        };
        return listDate;
    }
    dateRange = (startDate, endDate) => {
        let start = startDate.split('-');
        let end = endDate.split('-');
        let startYear = parseInt(start[0]);
        let endYear = parseInt(end[0]);
        let dates = [];

        for(let i = startYear; i <= endYear; i++) {
            let endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
            let startMon = i === startYear ? parseInt(start[1])-1 : 0;
            for(let j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j+1) {
                var month = j+1;
                var displayMonth = month < 10 ? '0'+month : month;
                dates.push([i, displayMonth, new Date(endDate).getDate().toString().padStart(2,'0')].join('-'));
            }
        }
        return dates;
    }
    search = (nameKey, myArray) => {
        for (var i=0; i < myArray.length; i++) {
            if (myArray[i].data === nameKey) {
                return myArray[i].total;
            }
        }
    }

     diff = (arr, arr2) => {
        let ret = [];
         const elements = arr.map((item) => {
             return {
                 data: `${item.year 
                     ? item.year : new Date().getFullYear()}-${item.month}-${item.day 
                     ? item.day : new Date().getDate().toString().padStart(2, '0')}${item.hour ? ` ${item.hour}:00` : ''}`,
                 total: item.total
             }
         })
         for(let i = 0; i < arr2.length; i += 1) {
             if (elements.length === 0) {
                 ret.push({
                     "x": arr2[i],
                     "y": 0
                 });
             } else {
                 if (elements.findIndex(obj => obj.data === arr2[i]) > -1) {
                     ret.push({
                         "x": arr2[i],
                         "y": this.search(arr2[i], elements)
                     });
                 } else {
                     ret.push({
                         "x": arr2[i],
                         "y": 0
                     });

                 }
             }
         }
        return ret;
    };
    render(){

        const { category } = this.state;
        const { categories } = this.props;
        const palitra = ['#e4ebe7', '#e4ebe7', '#e4ebe7', '#e4ebe7','#f47560', '#eab331', '#f1e15b',];
        let pastFilterItem = '';
        let parseItem = '', pastParseItem = 'end', previousParseItem = 'all';
        let  colors = {}, categoriesSelect = [];
        let listDate = [];
        const todayAll = new Date();

        switch (this.props.filter) {
            case 'all':
                parseItem = `${todayAll.getFullYear()}-${(todayAll.getMonth()+1).toString().padStart(2, '0')}-${(todayAll.getDate()).toString().padStart(2, '0')}`;
                previousParseItem = '2019-01-01'
                break;
            case 'month':
                const todayMonth = new Date();
                parseItem = `${todayMonth.getFullYear()}-${(todayMonth.getMonth()+1).toString().padStart(2, '0')}-${(todayMonth.getDate()).toString().padStart(2, '0')}`;
                pastFilterItem = todayMonth.getMonth() - 1;
                todayMonth.setMonth(pastFilterItem);
                todayMonth.setDate(todayMonth.getDate()+1)
                previousParseItem = `${todayMonth.getFullYear()}-${(todayMonth.getMonth()+1).toString().padStart(2, '0')}-${(todayMonth.getDate()).toString().padStart(2, '0')}`
                break;
            case 'year':
                const todayYear = new Date();
                parseItem = `${todayYear.getFullYear()}-${(todayYear.getMonth()+1).toString().padStart(2, '0')}-${(todayYear.getDate()).toString().padStart(2, '0')}`;
                pastFilterItem = todayYear.getFullYear() - 1;
                todayYear.setFullYear(pastFilterItem);
                previousParseItem = `${todayYear.getFullYear()}-${(todayYear.getMonth()+1).toString().padStart(2, '0')}-${(todayYear.getDate()).toString().padStart(2, '0')}`
                break;
            case 'week':
                const todayWeek = new Date();
                pastFilterItem = todayWeek.getDate() - 6;
                parseItem = `${todayWeek.getFullYear()}-${(todayWeek.getMonth()+1).toString().padStart(2, '0')}-${todayWeek.getDate().toString().padStart(2, '0')}`;
                todayWeek.setDate(pastFilterItem)
                previousParseItem = `${todayWeek.getFullYear()}-${(todayWeek.getMonth()+1).toString().padStart(2, '0')}-${todayWeek.getDate().toString().padStart(2, '0')}`
                break;
            case 'today':
                const today = new Date()
                parseItem = `${today.getFullYear()}-${(today.getMonth()+1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')} 23:00`;
                previousParseItem = `${today.getFullYear()}-${(today.getMonth()+1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')} 00:00`
                break;
            case 'period':
                if (this.props.end && this.props.start) {
                    parseItem = `${this.props.end.getFullYear()}-${(this.props.end.getMonth()+1).toString().padStart(2, '0')}-${this.props.end.getDate().toString().padStart(2, '0')}`;
                    previousParseItem = `${this.props.start.getFullYear()}-${(this.props.start.getMonth()+1).toString().padStart(2, '0')}-${this.props.start.getDate().toString().padStart(2, '0')}`
                }
        }
        let diff = [];
        switch (this.props.filter) {
            case 'all':
                diff = this.dateRange(previousParseItem, parseItem);
                break;
            case 'year':
                diff = this.dateRange(previousParseItem, parseItem);
                break;
            case 'week':
                diff = this.weekDiff(previousParseItem, parseItem);
                break;
            case 'today':
                diff = this.hourDiff(previousParseItem);
                break;
            case 'month':
                diff = this.weekDiff(previousParseItem, parseItem);
                break;
            case 'period':
                diff = this.weekDiff(previousParseItem, parseItem);
                break;
        }
        if (categories && categories.length > 0) {
            if (category === '1') {
                listDate = categories.map((itemCat, i) => {
                    return {
                        "id": itemCat.nameRu,
                        "data": this.diff(itemCat.data, diff)
                    }
                })
            } else {
                for (let i = 0; i < categories.length; i++) {
                    if (categories[i]._id === category) {
                        listDate.push({
                            "id": categories[i].nameRu,
                            "data": this.diff(categories[i].data, diff)
                        })
                        break;
                    }
                }
            }
            for (const key in categories) {
                colors[categories[key].nameRu] = palitra[key];
            }
            categoriesSelect = categories.map((item, i) => {
                return {
                    id: item._id,
                    name: item.nameRu,
                }
            })
         }
        const options = categoriesSelect.map((item, i) => (
            <Option key={item.id}>{item.name}</Option>
        ))
        const getColor = bar => (colors[bar.id]);
        return (
            <div className="line-chart">
                <div className="line-chart--top">
                    <div>
                        <h2>График категорий обращений</h2>
                    </div>
                    <div className="filter-line">
                        <p>Показать:</p>
                        <Select value={this.state.category} defaultValue={'1'} onSelect={this.onSelect}>
                            <Option key="1">Все категории</Option>
                            {options}
                        </Select>
                    </div>
                </div>
                <div className="line-element">
                    {categories && categories.length > 0 ? <ResponsiveLine
                        data={listDate ? listDate.reverse() : []}
                        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
                        xScale={{
                        type: "point",
                        // format: '%d-%m-%Y',
                        // precision: "day"
                    }}
                        // xFormat={`time:%d-%m-%Y`}
                        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, }}
                        axisRight={null}
                        axisBottom={{
                        tickValues: [previousParseItem, parseItem ]
                    }}
                        colors={getColor}
                        pointSize={6}
                        colorBy="id"
                        pointColor={{ theme: 'background' }}
                        pointBorderWidth={2}
                        pointBorderColor={{ from: 'serieColor' }}
                        pointLabel="y"
                        pointLabelYOffset={-12}
                        useMesh={true}
                        legends={[
                        {
                            anchor: 'bottom',
                            direction: 'row',
                            justify: false,
                            translateX: 10,
                            translateY: 45,
                            itemsSpacing: 0,
                            itemDirection: 'left-to-right',
                            itemWidth: 90,
                            itemHeight: 20,
                            itemOpacity: 0.75,
                            symbolSize: 12,
                            symbolShape: 'circle',
                            symbolBorderColor: 'rgba(0, 0, 0, .5)',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemBackground: 'rgba(0, 0, 0, .03)',
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                    /> : <b>Обращении не было</b>}
                </div>
            </div>
        )

    }
}
export default  LineChart;