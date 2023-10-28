import React, { useEffect, useState } from 'react';
import gridplace from './BlockCommunityPool.module.scss';
import styles from './BlockCharts.module.scss';
import Chart from 'react-apexcharts';

import StyledBox from '../../sharedComponents/StyledBox';
import { metEnFormeGrandNombre2 } from '../../application/AppUtils';
import { getCommunityPool } from './getCommunityPool';
import { AppContext } from '../../application/AppContext';


const BlockCommunityPool = () => {

    // Variables react
    const [isLoading, setIsLoading] = useState(true);
    const [msgErreur, setMsgErreur] = useState();

    const [timeunit, setTimeunit] = useState();
    const [tblLuncInCP, setTblLuncInCP] = useState([]);
    const [tblUstcInCP, setTblUstcInCP] = useState([]);
    const [tblDatetime, setTblDatetime] = useState([]);
    const [lastLuncValue, setLastLuncValue] = useState('...');
    const [lastUstcValue, setLastUstcValue] = useState('...');
    const [minLuncValue, setMinLuncValue] = useState(0);
    const [minUstcValue, setMinUstcValue] = useState(0);

    const { theme } = AppContext();


    // Fonction de sélection d'unité de temps
    const handleClickOnTimeUnits = (val) => {
        setTimeunit(val);
        loadDataWithThisTimeunit(val);
    }

    // Fonction de filtrage des valeurs
    const loadDataWithThisTimeunit = (valFiltre) => {
        setIsLoading(true);
        setTblLuncInCP([]);
        setTblUstcInCP([]);
        setTblDatetime([]);
        setLastLuncValue('...');
        setLastUstcValue('...');
        setMinLuncValue(0);
        setMinUstcValue(0);

        getCommunityPool(valFiltre).then((res) => {
            if(res['erreur']) {
                setIsLoading(false);
                setMsgErreur(res['erreur']);
            }
            else {
                setTblLuncInCP(res['nbLuncInCP']);
                setTblUstcInCP(res['nbUstcInCP']);
                setTblDatetime(res['datetime']);
                setLastLuncValue(res['lastLunc']);
                setLastUstcValue(res['lastUstc']);
                setMinLuncValue(res['minLunc'])
                setMinUstcValue(res['minUstc'])
                setIsLoading(false);
                setMsgErreur("");
            }
        })
    }

    // Chargement des données
    useEffect(() => {
        handleClickOnTimeUnits('H4');
        // eslint-disable-next-line
    }, [])

    // Et affichage
    return (
        <StyledBox title="Community Pool" color="purple" className={gridplace.communityPool}>
            <div className={styles.entete}>
                <div className={styles.libelle}>
                    <div>Lunc : <strong>{metEnFormeGrandNombre2(lastLuncValue, 4)}</strong></div>
                    <div>Ustc : <strong>{metEnFormeGrandNombre2(lastUstcValue, 4)}</strong></div>
                </div>
                <div className={styles.tblTimeunits}>
                    <button className={timeunit === 'H1' ? styles.selectedFilter : ""} onClick={() => handleClickOnTimeUnits('H1')}><strong>1h</strong></button>
                    <button className={timeunit === 'H4' ? styles.selectedFilter : ""} onClick={() => handleClickOnTimeUnits('H4')}><strong>4h</strong></button>
                    <button className={timeunit === 'D1' ? styles.selectedFilter : ""} onClick={() => handleClickOnTimeUnits('D1')}><strong>D</strong></button>
                    <button className={timeunit === 'W1' ? styles.selectedFilter : ""} onClick={() => handleClickOnTimeUnits('W1')}><strong>W</strong></button>
                    {/* <button className={timeunit === 'M1' ? styles.selectedFilter : ""} onClick={() => handleClickOnTimeUnits('M1')}><strong>M1</strong></button> */}
                </div>
            </div>
            {msgErreur ?
                <div className="erreur">{msgErreur}</div>
            :
                <div className={styles.charts}>
                    <div className={styles.chart}>
                        <Chart
                            series={[{
                                name: "LUNC",
                                type: "line",
                                data: tblLuncInCP
                            }, {
                                name: "USTC",
                                type: "line",
                                data: tblUstcInCP
                            },]}
                            width={"100%"}
                            height={"100%"}
                            options={{
                                noData: {
                                    text: isLoading ? 'Loading "CP history" from API, please wait ...' : 'No data, sorry',
                                    align: 'center',
                                    verticalAlign: 'middle',
                                    offsetX: 0,
                                    offsetY: 0,
                                    style: {
                                        color: undefined,
                                        fontSize: '0.9rem',
                                        fontFamily: undefined
                                    }
                                },
                                stroke: {
                                    width: 3,
                                    curve: 'smooth'
                                },
                                colors: ['var(--green-color)', 'var(--orange-color)'],
                                // colors: ['var(--blue-color)', 'var(--green-color)'],
                                labels: tblDatetime,
                                chart: {
                                    stacked: false,
                                    toolbar: {
                                        show: false
                                    },
                                    zoom: {
                                        enabled: false
                                    },
                                    foreColor: 'var(--primary-text-color)'      // Couleur des valeurs en abscisse/ordonnée
                                },
                                yaxis: [{
                                    min: minLuncValue,
                                    labels: {
                                        formatter: (valeur) => metEnFormeGrandNombre2(valeur, 4)
                                    }
                                }, {
                                    seriesName: 'USTC',
                                    min: minUstcValue,
                                    opposite: true,
                                    labels: {
                                        formatter: (valeur) => metEnFormeGrandNombre2(valeur, 4)
                                    }
                                }],
                                tooltip: {
                                    theme: theme === "light" ? 'light' : 'dark'
                                }
                            }}
                        />
                    </div>
                </div>
            }
        </StyledBox>
    );
};

export default BlockCommunityPool;