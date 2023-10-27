import React, { useEffect, useState } from 'react';
import styles from './BlockLuncTotalSupplies.module.scss';
import Chart from 'react-apexcharts';

import StyledBox from '../../sharedComponents/StyledBox';
import { getLuncTotalSupplies } from './getLuncTotalSupplies';


const BlockLuncTotalSupplies = () => {

    // Variables react
    const [isLoading, setIsLoading] = useState(true);
    const [tblLuncTotalSupplies, setTblLuncTotalSupplies] = useState();
    const [tblDatetimeTotalSupplies, setTblDatetimeTotalSupplies] = useState();
    const [msgErreur, setMsgErreur] = useState();

    // Chargement des données
    useEffect(() => {

        setIsLoading(true);
        setTblLuncTotalSupplies([]);
        setTblDatetimeTotalSupplies([]);

        getLuncTotalSupplies().then((res) => {
            if(res['erreur']) {
                setIsLoading(false);
                setMsgErreur(res['erreur']);
            }
            else {
                setTblLuncTotalSupplies(res['LuncSupplies']);
                setTblDatetimeTotalSupplies(res['datetime']);
                setIsLoading(false);
                setMsgErreur("");
            }
        })

    }, [])

    // Et affichage
    return (
        <StyledBox title="LUNC total supply" color="blue" className={styles.totalSuppliesBlock}>
            {msgErreur ?
                <div className="erreur">{msgErreur}</div>
            :
                isLoading ?
                    <div>Loading "LUNC total supplies history" from API, please wait ...</div>
                :
                    <div className={styles.charts}>
                        <div className={styles.chart}>
                            <Chart
                                series={[{
                                    name: "LUNC total supply",
                                    type: "line",
                                    data: tblLuncTotalSupplies
                                }]}
                                width={"100%"}
                                height={"100%"}
                                options={{
                                    stroke: {
                                        width: 2
                                    },
                                    // title: {
                                    //     text: 'LUNC total supply'
                                    // },
                                    labels: tblDatetimeTotalSupplies,
                                    chart: {
                                        toolbar: {
                                            show: false
                                        },
                                        zoom: {
                                            enabled: false
                                        },
                                        foreColor: 'var(--primary-text-color)'      // Couleur des valeurs en abscisse/ordonnée
                                    },
                                    yaxis: {
                                        title: {
                                            text: 'LUNC',
                                        },
                                    },
                                    xaxis: {
                                        title: {
                                            text: 'Datetime',
                                        },
                                    }
                                }}
                            />
                        </div>
                    </div>
            }
        </StyledBox>
    );
};

export default BlockLuncTotalSupplies;