import React, { useEffect, useState } from 'react';
import styles from './BlockTotalSupplies.module.scss';
import Chart from 'react-apexcharts';

import StyledBox from '../../sharedComponents/StyledBox';
import { getHistoricalTotalSupplies } from './getHistoricalTotalSupplies';


const BlockTotalSupplies = () => {

    // Variables react
    const [isLoading, setIsLoading] = useState(true);
    const [tblLuncTotalSupplies, setTblLuncTotalSupplies] = useState();
    const [tblUstcTotalSupplies, setTblUstcTotalSupplies] = useState();
    const [tblDatetimeTotalSupplies, setTblDatetimeTotalSupplies] = useState();
    const [msgErreur, setMsgErreur] = useState();

    // Chargement des données
    useEffect(() => {

        setIsLoading(true);
        setTblLuncTotalSupplies([]);
        setTblUstcTotalSupplies([]);
        setTblDatetimeTotalSupplies([]);

        getHistoricalTotalSupplies().then((res) => {
            if(res['erreur']) {
                setIsLoading(false);
                setMsgErreur(res['erreur']);
            }
            else {
                setTblLuncTotalSupplies(res['LuncSupplies']);
                setTblUstcTotalSupplies(res['UstcSupplies']);
                setTblDatetimeTotalSupplies(res['datetime']);
                setIsLoading(false);
                setMsgErreur("");
            }
        })

    }, [])

    // Et affichage
    return (
        <div className={styles.totalSuppliesBlock}>
            {msgErreur ?
                <div className="erreur">{msgErreur}</div>
            :
                isLoading ?
                    <div>Loading "historical total supplies" from API, please wait ...</div>
                :
                    <div className={styles.charts}>
                        <StyledBox title="LUNC total supply" color="blue">
                            <div className={styles.leftChart}>
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
                        </StyledBox>
                        <StyledBox title="USTC total supply" color="blue">
                            <div className={styles.rightChart}>
                                <Chart
                                    series={[{
                                        name: "USTC total supply",
                                        type: "line",
                                        data: tblUstcTotalSupplies
                                    }]}
                                    width={"100%"}
                                    height={"100%"}
                                    options={{
                                        stroke: {
                                            width: 2
                                        },
                                        // title: {
                                        //     text: 'USTC total supply'
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
                                                text: 'USTC',
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
                        </StyledBox>
                    </div>
            }
        </div>
    );
};

export default BlockTotalSupplies;