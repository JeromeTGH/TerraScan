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
        <StyledBox title="Total Supplies" color="blue" className={styles.totalSuppliesBlock}>
            {msgErreur ?
                <div className="erreur">{msgErreur}</div>
            :
                isLoading ?
                    <div>Loading "historical total supplies" from API, please wait ...</div>
                :
                    <div className={styles.charts}>
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
                                    title: {
                                        text: 'LUNC total supply'
                                    },
                                    labels: tblDatetimeTotalSupplies,
                                }}
                            />
                        </div>
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
                                    title: {
                                        text: 'USTC total supply'
                                    },
                                    labels: tblDatetimeTotalSupplies,
                                }}
                            />
                        </div>
                    </div>
            }
        </StyledBox>
    );
};

export default BlockTotalSupplies;