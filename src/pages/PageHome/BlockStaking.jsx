import React from 'react';
import { LockIcon } from '../../application/AppIcons';
// import Chart from 'react-apexcharts';
// import styles from './BlockStaking.module.scss';

const BlockStaking = () => {

    return (
        <>
            <h2><strong><LockIcon /></strong><span><strong>Staking</strong></span></h2>

            {/* <Chart
                type="radialBar"
                // width={"50%"}
                // height={300}
                series={[15]}
                options={{
                    labels: ['Staked LUNC'],
                    colors:['var(--primary-fill)', 'pink'],         // Couleurs de la série et textes labels associés (data-labels)
                    chart: {
                        foreColor: 'var(--primary-text-color)'      // Couleur des valeurs (data-values)
                    },
                    plotOptions: {
                        radialBar: {
                            track: {
                              background: 'var(--unprimary-fill)'   // Couleur de fond de l'anneau, lorsque "non coloré"
                            }
                        }
                    }
                }}
            /> */}

        </>
    );
};

export default BlockStaking;