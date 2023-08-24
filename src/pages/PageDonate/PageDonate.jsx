import React, { useEffect, useState } from 'react';
import styles from './PageDonate.module.scss';
import { CopyIcon } from '../../application/AppIcons';
import { appName } from '../../application/AppParams';

const PageDonate = () => {

    // Variables
    const terraAddress = 'terra12gw6wuav6cyezly29t66tpnty5q2ny3d2r88gd';
    const [msgCopied, setMsgCopied] = useState('');


    // À exécuter au démarrage
    useEffect(() => {
        // Changement du "title" de la page web
        document.title = 'Donate - ' + appName;
    }, [])


    // OnClick du bouton "copier adresse"
    const handleClickOnCopyButton = () => {
        navigator.clipboard.writeText(terraAddress).then(() => {
            setMsgCopied('Copied !');
        }).catch(() => {
            setMsgCopied('Unable to write to clipboard, sorry ...')
        })
    }


    // Affichage
    return (
        <div className={styles.blocDonate}>
            <h2>
                <i>For donations, thank you !</i>
            </h2>
            <div>
                <img src='/terra-scan-qr.png' alt="Terra Scan Qr" />
            </div>
            <div className={styles.txtAddress}>
                <p>Or copy/paste this address : </p>
                <p>
                    <strong>{terraAddress}</strong>
                    <CopyIcon onClick={() => handleClickOnCopyButton()} />
                </p>
            </div>
            <div className='colore'>
                <strong><i>{msgCopied}</i></strong>
            </div>
        </div>
    );
};

export default PageDonate;