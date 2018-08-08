import React, { PureComponent } from 'react';
import styles from './RetweetGraph.css';
import Tooltip from '../Tooltip/Tooltip';

// Semiotic and D3 make up well over half the bundle, and as the library is transpiled
// webpack couldn't tree shake the code. Only importing the file used and using
// dynamic imports reduced the main bundle from 947 kB to 328 kB (89 kB gzipped).

class RetweetGraph extends PureComponent {
    state = {};

    componentDidMount() {
        import(/* webpackChunkName: "xyFrame" */ 'semiotic/lib/ResponsiveXYFrame').then(
            ResponsiveXYFrame =>
                this.setState({ ResponsiveXYFrame: ResponsiveXYFrame.default })
        );
    }

    render() {
        const { ResponsiveXYFrame } = this.state;

        const { tweets } = this.props;
        const totalRetweets = tweets.reduce(
            (total, current) => total + current.retweet_count,
            0
        );

        const coordinates = tweets.map(({ created_at, retweet_count }) => ({
            date: Date.parse(created_at),
            retweet_count
        }));

        const areaPoints = [
            { ...coordinates[0], retweet_count: 0 },
            ...coordinates,
            { ...coordinates[coordinates.length - 1], retweet_count: 0 }
        ];

        return (
            <div className={styles.graph}>
                <div className={styles.infobar}>
                    <h1>Retweets for your last 50 tweets</h1>
                    <span>{`${totalRetweets} retweets`}</span>
                </div>
                {ResponsiveXYFrame ? (
                    <ResponsiveXYFrame
                        size={[700, 207]}
                        responsiveWidth
                        lines={[{ coordinates }]}
                        areas={[{ areaPoints }]}
                        xAccessor="date"
                        yAccessor="retweet_count"
                        areaDataAccessor="areaPoints"
                        lineStyle={{
                            stroke: '#3C74FF',
                            strokeWidth: '2px',
                            background: 'rgba(60, 116, 255, 0.16)'
                        }}
                        areaStyle={{
                            fill: 'rgba(60, 116, 255, 0.16)'
                        }}
                        hoverAnnotation={[
                            { type: 'frame-hover', color: 'transparent' }
                        ]}
                        tooltipContent={props => <Tooltip {...props} />}
                    />
                ) : (
                    <div className={styles.loading}>Loading Graph...</div>
                )}
            </div>
        );
    }
}

export default RetweetGraph;
