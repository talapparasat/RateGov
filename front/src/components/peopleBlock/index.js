import React, {Component} from 'react';
class PeopleBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChange: false,
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
    render() {
        const { isChange } = this.state;
        return(
            <div className="analytics-gender">
                <div className="card-item">
                    <h1>Гендерное разделение</h1>
                    <div className="gender-card">
                        <div style={{marginRight: '10px'}}>
                            <div className="gender-text-img">
                                <div className="gender-icon">
                                    <img src="/assets/icon-man.svg" alt="all"/>
                                </div>
                                <h2 style={{color: '#3189ea'}}>{isChange ? Math.floor(Math.random()*500) : 56}</h2>
                            </div>
                            <span>Мужчины</span>
                        </div>
                        <div>
                            <div className="gender-text-img">
                                <div className="gender-icon">
                                    <img src="/assets/icon-woman.svg" alt="all"/>
                                </div>
                                <h2 style={{color: '#ea31af'}}>{isChange ? Math.floor(Math.random()*500) : 32}</h2>
                            </div>
                            <span>Женщины</span>
                        </div>
                    </div>
                </div>
                <div className="card-item">
                    <h1>Средний возраст</h1>
                    <div className="gender-card" >
                        <div>
                            <div className="gender-text-img">
                                <div className="card-icon">
                                    <h2 style={{color: '#000000'}}>{isChange ? Math.floor(Math.random()*500) : 120}</h2>
                                </div>
                            </div>
                            <span>Все</span>
                        </div>
                        <div style={{marginRight: '10px'}}>
                            <div className="gender-text-img">
                                <div className="gender-icon">
                                    <img src="/assets/icon-man.svg" alt="all"/>
                                </div>
                                <h2 style={{color: '#3189ea'}}>{isChange ? Math.floor(Math.random()*500) : 55}</h2>
                            </div>
                            <span>Мужчины</span>
                        </div>
                        <div >
                            <div className="gender-text-img">
                                <div className="gender-icon">
                                    <img src="/assets/icon-woman.svg" alt="all"/>
                                </div>
                                <h2 style={{color: '#ea31af'}}>{isChange ? Math.floor(Math.random()*500) : 40}</h2>
                            </div>
                            <span>Женщины</span>
                        </div>
                    </div>
                </div>
                <div className="card-item">
                    <h1>Безработные</h1>
                    <div className="gender-card" >
                        <div>
                            <div className="gender-text-img">
                                <div className="card-icon">
                                    <h2 style={{color: '#000000'}}>{isChange ? Math.floor(Math.random()*500) : 140}</h2>
                                </div>
                            </div>
                            <span>Все</span>
                        </div>
                        <div style={{marginRight: '10px'}}>
                            <div className="gender-text-img">
                                <div className="gender-icon">
                                    <img src="/assets/icon-man.svg" alt="all"/>
                                </div>
                                <h2 style={{color: '#3189ea'}}>{isChange ? Math.floor(Math.random()*500) : 33}</h2>
                            </div>
                            <span>Мужчины</span>
                        </div>
                        <div>
                            <div className="gender-text-img">
                                <div className="gender-icon">
                                    <img src="/assets/icon-woman.svg" alt="all"/>
                                </div>
                                <h2 style={{color: '#ea31af'}}>{isChange ? Math.floor(Math.random()*500) : 40}</h2>
                            </div>
                            <span>Женщины</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default PeopleBlock