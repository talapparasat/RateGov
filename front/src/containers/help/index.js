import React, {Component} from 'react'
import {connect} from 'react-redux';
import "video-react/dist/video-react.css";
import {Player} from 'video-react';
import {Divider} from 'antd'


class Help extends Component {

    state = {};

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <h1 style={{marginBottom: '40px'}}>Помощь</h1>
            </div>
        )
    }
}

export default connect()(Help);