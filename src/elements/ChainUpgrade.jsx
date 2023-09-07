import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tblLatestBlockAtAppLoading } from '../application/AppData';
import { expanded_datetime_ago, formateLeNombre, metEnFormeDateTime } from '../application/AppUtils';

const ChainUpgrade = () => {

    // Constantes
    const blockUpgrade = 14514000;
    const nbSecondsPerBlock = 6;        // Moyenne, approximatif ici

    // Variables
    const [estimatedDateTimeUpgrade, setEstimatedDateTimeUpgrade] = useState();
    const [nbBlocksLeft, setNbBlocksLeft] = useState();

    // Exécution au chargement de ce component
    useEffect(() => {

        // Détermination du nombre de blocks restant, avant upgrade
        const blocksLeft = blockUpgrade - tblLatestBlockAtAppLoading['height'];
        setNbBlocksLeft(blocksLeft);

        // Calcul de la date/heure à laquelle l'upgrade aura lieu
        const timestampLatestBlock = new Date(tblLatestBlockAtAppLoading['datetime']).getTime();
        const estimatedTimestampUpgrade = timestampLatestBlock + blocksLeft*nbSecondsPerBlock*1000;       // *1000 pour conversion ms en secondes
        const estimatedDatetimeUpgrade = new Date(estimatedTimestampUpgrade).toISOString();
        setEstimatedDateTimeUpgrade(estimatedDatetimeUpgrade);

    }, [])

    // Affichage
    return (
        <>
            {nbBlocksLeft > 0 ?
                <div className='annonce'>
                    <img className='annonce_image' src='/images/warning_icon_32x32.png' alt='Warning logo' />If <Link to='/proposals/11766'>proposal #11766</Link> from L1TF is adopted, our chain will be <a href="https://twitter.com/TheVinhNguyen4/status/1698732222755512659" target='_blank' rel='noopener noreferrer'>upgraded to version v2.2.1</a>. This upgrade would occur at block "{formateLeNombre(blockUpgrade, '\u00a0')}", so approximatively <strong>in {estimatedDateTimeUpgrade ? expanded_datetime_ago(estimatedDateTimeUpgrade, true) : '...'}</strong> ({estimatedDateTimeUpgrade ? metEnFormeDateTime(estimatedDateTimeUpgrade) : '...'}).
                </div>
            : null}
        </>
    );
};

export default ChainUpgrade;