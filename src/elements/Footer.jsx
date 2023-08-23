import React from 'react';
import styles from './Footer.module.scss';
import { useNavigate } from 'react-router-dom';
import { CoffeeIcon } from '../application/AppIcons';

const Footer = () => {

    const navigate = useNavigate();

    // Fonction de redirection "donate"
    const handleDon = () => {
        navigate('/donate/');
    }

    // Affichage
    return (
        <div className={styles.footerContainer}>
            <br />
            <hr />
            <div className={styles.footerTwoCols}>
                <p className={styles.footerTxt}>Want <strong>to help me</strong> ? To make this app sustainable ? So <strong>please donate</strong> ! Thanks ;)</p>
                <button onClick={() => handleDon()}><CoffeeIcon /><span>Donate</span></button>
            </div>
        </div>
    );
};

export default Footer;