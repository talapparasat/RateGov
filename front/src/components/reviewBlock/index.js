import React, {Component} from 'react';
class ReviewBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChange: false,
        }
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if((nextProps.filter !== this.props.filter || nextProps.region !== this.props.region)  && nextProps.visible ) {
            this.setState({
                isChange: true,
                all: Math.floor(Math.random() * 500 + 300),
                resolved: Math.floor(Math.random() * 200),
                active: Math.floor(Math.random() * 300)
            })
        } else {
            this.setState({
                isChange: false
            })
        }

    }
    render() {
        const { isChange, all, resolved, active } = this.state;
        const { review } = this.props;
        let reviews = '';
        if (review) {
            reviews =  <div className="analytics-reviews">
                <div className="review-card">
                    <div>
                        <h2>{review.all}</h2>
                        <span>Все обращения</span>
                    </div>
                    <div className="card-icon">
                        <img src="/assets/comment.svg" alt="all"/>
                    </div>
                </div>
                <div className="review-card">
                    <div>
                        <h2 style={{color: "#eab331"}}>{review.inProcess}</h2>
                        <span>Активные</span>
                    </div>
                    <div className="card-icon">
                        <img src="/assets/comment1.svg" alt="active"/>
                    </div>
                </div>
                <div className="review-card">
                    <div>
                        <h2 style={{color: "#3dbd33"}}>{review.resolved}</h2>
                        <span>Завершенные</span>
                    </div>
                    <div className="card-icon">
                        <img src="/assets/comment2.svg" alt="solved"/>
                    </div>
                </div>
            </div>
        }
        return(
            reviews
        )
    }
}
export default ReviewBlock