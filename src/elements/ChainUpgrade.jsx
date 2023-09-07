import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tblLatestBlockAtAppLoading } from '../application/AppData';
import { expanded_datetime_ago, formateLeNombre, metEnFormeDateTime } from '../application/AppUtils';
import { loadBlockFromLCD } from '../dataloaders/loadBlockFromLCD';

const ChainUpgrade = () => {
    
    // ---------------------------
    const blockUpgrade = 14514000;
    // ---------------------------


    // Constantes
    const nbBlockEnArrierePourEstimationVitesse = 30000;
    
    // Variables
    const [estimatedDateTimeUpgrade, setEstimatedDateTimeUpgrade] = useState();


    // Exécution au chargement de ce component
    useEffect(() => {

        loadBlockFromLCD(tblLatestBlockAtAppLoading['height'] - nbBlockEnArrierePourEstimationVitesse).then((res) => {

            // Récupération des infos d'un block éloigné (pour faire des calculs de moyenne)
            const oldBlockDatetime = res.header.time;
            const oldBlockTimestamp = new Date(oldBlockDatetime).getTime();

            // Récupération des infos du dernier block connu
            const latestBlockTimestamp = new Date(tblLatestBlockAtAppLoading['datetime']).getTime();

            // Calcul d'écart de temps entre les deux (qui nous donnera le nombre de seconde moyen de génération d'un nouveau bloc, combiné à leurs heights)
            const calculateNbSecondsPerBlock = (latestBlockTimestamp - oldBlockTimestamp) / nbBlockEnArrierePourEstimationVitesse / 1000;
           
            // Calcul de la date/heure à laquelle l'upgrade aura lieu
            const nbBlocksLeft = blockUpgrade - tblLatestBlockAtAppLoading['height'];
            if(nbBlocksLeft > 0) {
                const timestampLatestBlock = new Date(tblLatestBlockAtAppLoading['datetime']).getTime();

                const estimatedTimestampUpgrade = timestampLatestBlock + (nbBlocksLeft*calculateNbSecondsPerBlock*1000);       // *1000 pour conversion ms en secondes
                const estimatedDatetimeUpgrade = new Date(estimatedTimestampUpgrade).toISOString();
                setEstimatedDateTimeUpgrade(estimatedDatetimeUpgrade);
            }

        })
    }, [])


    // Affichage
    return (
        <>
            <div className='annonce'>
                <img className='annonce_image' src='/images/warning_icon_32x32.png' alt='Warning logo' />
                <span>If L1TF <Link to='/proposals/11766'>proposal #11766</Link> is adopted, our blockchain will be <a href="https://twitter.com/TheVinhNguyen4/status/1698732222755512659" target='_blank' rel='noopener noreferrer'>upgraded to version v2.2.1</a>. </span>
                {estimatedDateTimeUpgrade ? <span>This upgrade would occur at block "{formateLeNombre(blockUpgrade, '.')}", so approximatively <strong>in {expanded_datetime_ago(estimatedDateTimeUpgrade, true)}</strong> ({metEnFormeDateTime(estimatedDateTimeUpgrade)}). Refresh this page as needed, to refresh these infos ! Thx ;)</span> : null}
            </div>
        </>
    );
};

export default ChainUpgrade;