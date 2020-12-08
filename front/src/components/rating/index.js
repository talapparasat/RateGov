import React, {Component} from "react";
import './rating.css';
import classnames from "classnames";
import Icon from "antd/es/icon";
class Rating extends Component{
    constructor(props) {
        super(props);
        this.state = {
            activeRegion: true,
            activeDistrict: true,
            activeService: true
        };
    }
    handleSortRegion = () => {
        this.setState({
            activeRegion: !this.state.activeRegion
        })
    }
    handleSortDistrict= () => {
        this.setState({
            activeDistrict: !this.state.activeDistrict
        })
    }
    handleSortService = () => {
        this.setState({
            activeService: !this.state.activeService
        })
    }
    render() {
        const {raions, regions, services}  = this.props;
        let regionsInner = [], districts = [], servicesInner = [];
        if (regions) {
            if (this.state.activeRegion) {
                regionsInner = regions[0].worst.map((item, i) => (
                    <div key={i} className="rating-list--item">
                        <p>{i + 1}. {item.nameRu}</p>
                        <div className="progress">
                            <div style={{width: item.rate * 20 + '%'}} className="progress-inner"/>
                        </div>
                        <div className="rating-count">
                            <Icon style={{color: '#eec643', fontSize: '10px', marginRight: '5px'}} theme='filled'
                                  type='star'/>
                            <p>{Math.round(item.rate * 10) / 10}</p>
                        </div>
                    </div>
                ));
            } else {
                regionsInner = regions[0].best.map((item, i) => (
                    <div key={i} className="rating-list--item">
                        <p>{i + 1}. {item.nameRu}</p>
                        <div className="progress">
                            <div style={{width: item.rate * 20 + '%'}} className="progress-inner"/>
                        </div>
                        <div className="rating-count">
                            <Icon style={{color: '#eec643', fontSize: '10px', marginRight: '5px'}} theme='filled'
                                  type='star'/>
                            <p>{Math.round(item.rate * 10) / 10}</p>
                        </div>
                    </div>
                ));
            }
        }
        if (raions) {
            if (this.state.activeDistrict) {
                districts = raions[0].worst.map((item, i) => (
                    <div key={i} className="rating-list--item">
                        <p>{i + 1}. {item.nameRu}</p>
                        <div className="progress">
                            <div style={{width: item.rate * 20 + '%'}} className="progress-inner"/>
                        </div>
                        <div className="rating-count">
                            <Icon style={{color: '#eec643', fontSize: '10px', marginRight: '5px'}} theme='filled'
                                  type='star'/>
                            <p>{Math.round(item.rate * 10) / 10}</p>
                        </div>
                    </div>
                ))
            } else {
                districts = raions[0].best.map((item, i) => (
                    <div key={i} className="rating-list--item">
                        <p>{i + 1}. {item.nameRu}</p>
                        <div className="progress">
                            <div style={{width: item.rate * 20 + '%'}} className="progress-inner"/>
                        </div>
                        <div className="rating-count">
                            <Icon style={{color: '#eec643', fontSize: '10px', marginRight: '5px'}} theme='filled'
                                  type='star'/>
                            <p>{Math.round(item.rate * 10) / 10}</p>
                        </div>
                    </div>
                ))
            }
        }
        if (services) {
            if (this.state.activeService) {
                servicesInner = services[0].best.map((item, i) => (
                    <div key={i} className="service-rating">
                        <p>{i + 1}. {item.nameRu}</p>
                        <div className="service-count">
                            <Icon style={{color: '#eec643', fontSize: '10px', marginRight: '5px'}} theme='filled'
                                  type='star'/>
                            <p>{Math.round(item.rate * 10) / 10}</p>
                        </div>
                    </div>
                ))
            } else {
                servicesInner = services[0].worst.map((item, i) => (
                    <div key={i} className="service-rating">
                        <p>{i + 1}. {item.nameRu}</p>
                        <div className="service-count">
                            <Icon style={{color: '#eec643', fontSize: '10px', marginRight: '5px'}} theme='filled'
                                  type='star'/>
                            <p>{Math.round(item.rate * 20) / 10}</p>
                        </div>
                    </div>
                ))
            }
        }
        return (
            <div className="rating">
                <div className="rating-card">
                    <h1>Рейтинг регионов</h1>
                    <div>
                        <span onClick={this.handleSortRegion} className={classnames("sort", {"sort-active": this.state.activeRegion})} >Худшие</span>
                        <span onClick={this.handleSortRegion} className={classnames("sort", {"sort-active": !this.state.activeRegion})}  >Лучшие</span>
                    </div>
                    <div className="rating-list">
                        {regionsInner}
                    </div>
                </div>
                <div className="rating-card">
                    <h1>Рейтинг районов</h1>
                    <div>
                        <span onClick={this.handleSortDistrict} className={classnames("sort", {"sort-active": this.state.activeDistrict})} >Худшие</span>
                        <span onClick={this.handleSortDistrict} className={classnames("sort", {"sort-active": !this.state.activeDistrict})}  >Лучшие</span>
                    </div>
                    <div className="rating-list">
                        {districts}
                    </div>
                </div>
                <div className="rating-card">
                    <h1>Рейтинг услуг</h1>
                    <div>
                        <span onClick={this.handleSortService} className={classnames("sort", {"sort-active": this.state.activeService})}>Популярные</span>
                        <span onClick={this.handleSortService} className={classnames("sort", {"sort-active": !this.state.activeService})}>Непопулярные</span>
                    </div>
                    <div className="rating-list">
                        {servicesInner}
                    </div>
                </div>
            </div>
        );
    }
}
export default Rating;

