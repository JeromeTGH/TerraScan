import React, { useEffect, useState } from 'react';
import OutlinedBox from '../../sharedComponents/OutlinedBox/OutlinedBox';
import { DashboardIcon, ParamsIcon, LockIcon } from '../../application/AppIcons';
import styles from './PageHome.module.scss';
import TableOfLatestBlocks from './TableOfLatestBlocks';
import TableOfTotalSupplies from './TableOfTotalSupplies';


const PageHome = () => {

    // Variables react
    // const [ infosTotalSupply, setInfosTotalSupply ] = useState([]);     // Tableau qui contiendra des infos concernant les total supplies
    // const [ infosMintingParams, setInfosMintingParams] = useState();    // Ici les paramètres de mint (inflation, essentiellement)
    const [datetimeDernierUpdate, setDatetimeDernierUpdate] = useState('...');

    useEffect(() => {
        // Mémorisation de la date/heure de chargement de cette page
        const maDate = Date.now();
        setDatetimeDernierUpdate(new Date(maDate).toLocaleString());
    }, [])


    // // Récupération d'infos, au chargement du component
    // useEffect(() => {
    //     // Chargement des infos concernant les total supplies
    //     lcd.bank.total({'pagination.limit': 9999}).then(res => {
    //         if(res[0]) {
    //             const listeDesCoinsSupply = new Coins(res[0]);
    //             setInfosTotalSupply(listeDesCoinsSupply.toData())

    //             // Chargement des infos concernant les taux d'inflation
    //             lcd.mint.parameters({}).then(res => {
    //                 setInfosMintingParams(res);
    //                 setEtatPage('ok');
    //             }).catch(err => {
    //                 setEtatPage(err.message);
    //                 console.log(err);
    //             })

    //         } else {
    //             setInfosTotalSupply(res);
    //             setEtatPage('message');
    //         }
    //     }).catch(err => {
    //         setEtatPage(err.message);
    //         console.log(err);
    //     })
    //     // eslint-disable-next-line
    // }, [])


    // Et affichage de la page, au final
    return (
        <div className={styles.homepage}>
            <h1><DashboardIcon /><span>Dashboard</span></h1>
            <p className={styles.datetimeupdate}>→ Last data update : {datetimeDernierUpdate}</p>
            <br />
            <br />
            <div className={styles.tbl421}>
                <OutlinedBox>
                    <div className={styles.content}>
                        <TableOfLatestBlocks />
                    </div>
                </OutlinedBox>
                <OutlinedBox>
                    <div className={styles.content}>
                        <TableOfTotalSupplies />
                    </div>
                </OutlinedBox>
                <OutlinedBox>
                    <div className={styles.content}>
                        <h2><strong><LockIcon /></strong><span><strong>Staking</strong></span></h2>
                    </div>
                </OutlinedBox>
                <OutlinedBox>
                    <div className={styles.content}>
                        <h2><strong><ParamsIcon /></strong><span><strong>Blockchain Parameters</strong></span></h2>
                    </div>
                </OutlinedBox>
            </div>
        </div>
    );
};

export default PageHome;