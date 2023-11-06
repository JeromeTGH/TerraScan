import React, { useEffect, useState } from 'react';
import gridplace from './BlockLuncTotalSupplies.module.scss';
import styles from './BlockCharts.module.scss';
import Chart from 'react-apexcharts';

import StyledBox from '../../sharedComponents/StyledBox';
import { getLuncTotalSupplies } from './getLuncTotalSupplies';
import { formateLeNombre, metEnFormeGrandNombre2 } from '../../application/AppUtils';
import { AppContext } from '../../application/AppContext';


const BlockLuncTotalSupplies = (props) => {

    // Variables react
    const [isLoading, setIsLoading] = useState(true);
    const [msgErreur, setMsgErreur] = useState();

    const [timeunit, setTimeunit] = useState();
    const [tblDatas, setTblDatas] = useState([]);
    const [lastValue, setLastValue] = useState('...');

    const { theme } = AppContext();


    // Fonction de sélection d'unité de temps
    const handleClickOnTimeUnits = (val) => {
        setTimeunit(val);
        loadDataWithThisTimeunit(val);
    }

    // Fonction de filtrage des valeurs
    const loadDataWithThisTimeunit = (valFiltre) => {
        setIsLoading(true);
        setTblDatas([]);
        setLastValue('...');

        getLuncTotalSupplies(props.commonDatas, valFiltre).then((res) => {
            if(res['erreur']) {
                setIsLoading(false);
                setMsgErreur(res['erreur']);
            }
            else {
                setTblDatas(res['donnees']);
                setLastValue(res['last']);
                setIsLoading(false);
                setMsgErreur("");
            }
        })
    }

    // Chargement des données
    useEffect(() => {
        handleClickOnTimeUnits('D1');
        // eslint-disable-next-line
    }, [])

    // Et affichage
    return (
        <StyledBox title="LUNC total supply" color="blue" className={gridplace.totalSuppliesBlock}>
            <div className={styles.entete}>
                <div className={styles.libelle}>Last : <strong>{metEnFormeGrandNombre2(lastValue, 4)}</strong></div>
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
                                name: "LUNC total supply",
                                type: "candlestick",
                                data: tblDatas
                            }]}
                            width={"100%"}
                            height={"100%"}
                            options={{
                                noData: {
                                    text: isLoading ? 'Loading "LUNC history" from API, please wait ...' : 'No data, sorry',
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
                                    width: 0.5
                                },
                                plotOptions: {
                                    candlestick: {
                                        colors: {
                                            upward: "#00B746",
                                            downward: "#FF0000"
                                        }
                                    }
                                },
                                chart: {
                                    toolbar: {
                                        show: false
                                    },
                                    zoom: {
                                        enabled: false
                                    },
                                    // foreColor: 'var(--primary-text-color)'      // Couleur des valeurs en abscisse/ordonnée
                                },
                                yaxis: {
                                    // title: {
                                    //     text: 'LUNC'
                                    // },
                                    labels: {
                                        formatter: (valeur) => metEnFormeGrandNombre2(valeur, 4)
                                    }
                                },
                                xaxis: {
                                    title: {
                                        text: 'Datetime (UTC)'
                                    }
                                },
                                tooltip: {
                                    theme: theme === "light" ? 'light' : 'dark',
                                    custom: function({ seriesIndex, dataPointIndex, w }) {
                                        const open = w.globals.seriesCandleO[seriesIndex][dataPointIndex]
                                        const close = w.globals.seriesCandleC[seriesIndex][dataPointIndex]
                                        // console.log("w", w.globals);
                                        const change = close-open;
                                        return (
                                            '<div style="border-radius: 5px; box-shadow: 2px 2px;">' +
                                                '<div class="apexcharts-tooltip-title" style="margin: 0; padding: 4px 6px; font-size: 12px; font-weight: 500;">' +
                                                    'LUNC total supply' +
                                                '</div>'+
                                                '<div class="apexcharts-tooltip-series-group-active" style="padding: 4px; margin: 0 4px 2px 4px; font-size: 12px; display: flex;">' +
                                                    '<div>Open&nbsp;&nbsp;<br />Close&nbsp;&nbsp;<br />Change&nbsp;&nbsp;<br />Date&nbsp;(close)&nbsp;&nbsp;</div>' +
                                                    '<div>' +
                                                        '<strong>' + formateLeNombre(open, ',') + '</strong><br />' +
                                                        '<strong>' + formateLeNombre(close, ',') + '</strong><br />' +
                                                        '<strong>' + formateLeNombre(change, ',') + '</strong><br />' +
                                                        '<strong>' + w.globals.categoryLabels[dataPointIndex] + '</strong>' +
                                                    '</div>' +
                                                '</div>' +
                                            '</div>'
                                        )
                                    }
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