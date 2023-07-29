import React from 'react';
import { LockIcon } from '../../application/AppIcons';
import Chart from 'react-apexcharts';

const SectionStaking = () => {

    return (
        <>
            <h2><strong><LockIcon /></strong><span><strong>Staking</strong></span></h2>

            <Chart
                type="radialBar"
                // width={300}
                // height={300}
                series={[15]}
                options={{
                    labels: ['Staked LUNC'],
                    colors:['#EE7C00'],
                    plotOptions: {
                        radialBar: {
                            track: {
                              background: '#DDDDDD'
                            }
                        }
                    }
                }}
            />
        </>
    );
};

export default SectionStaking;