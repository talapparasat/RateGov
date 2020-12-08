import React, { Component } from 'react';
import {ResponsiveBar} from "@nivo/bar";
import {BoxLegendSvg} from "@nivo/legends";
class BarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render(){
        const { social } = this.props;
        const BarLegend = ({ height, legends, width }) => (
          
            <React.Fragment>
                
                {legends.map(legend => (
                    <BoxLegendSvg
                        key={JSON.stringify(legend.data.map(({ id }) => id))}
                        {...legend}
                        containerHeight={height}
                        containerWidth={width}
                    />
                ))}
            </React.Fragment> 
        );
        let dataBar = []
        const keys = ["users"];
        const colors = ['#3189ea', '#3dbd33'];

        if (social) {
            for (let i = 0; i < 3; i++) {
                if (i === 0) {
                    dataBar.push({
                        "socialMedia": "Telegram",
                        "users": social.telegram,
                    })
                } else if (i === 1) {
                    dataBar.push({
                        "socialMedia": "Instagram",
                        "users": social.instagram,
                    })
                } else if (i === 2) {
                    dataBar.push({
                        "socialMedia": "Facebook",
                        "users": social.facebook,
                    })
                }

            }
        }
       
        return (
            <ResponsiveBar
                data={dataBar}
                keys={keys}
                indexBy="socialMedia"
                margin={{  bottom: 50, left: 60, right: 50 }}
                padding={0.3}
                groupMode="grouped"
                colors={colors}
                borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                layers={[BarLegend, "grid", "axes", "bars", "markers"]}
                legends={[
                    {
                        dataFrom: 'keys',
                        data: keys.map((id, index) => (
                            {
                                color: colors[index],
                                id,
                                label: id === "users" ? 'Пользователи' : ''
                            })),
                        anchor: 'bottom',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: 40,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 10,
                        symbolShape: 'circle',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
            />
        )

    }
}
export default  BarChart;