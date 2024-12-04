import React from 'react';
import styles from './Footer.module.scss';

const Footer = () => {

    // Variable
    const anneeEnCours = new Date().getFullYear();

    // const navigate = useNavigate();

    // // Fonction de redirection "donate"
    // const handleDon = () => {
    //     navigate('/donate/');
    // }

    // Affichage
    return (
        <div className={styles.footerContainer}>
            <br />
            {/* <hr /> */}
            {/* <div className={styles.footerTwoCols}>
                <p className={styles.footerTxt}>Want <strong>to help me</strong> ? To make this app sustainable ? So <strong>please donate</strong> ! Thanks ;)</p>
                <button onClick={() => handleDon()}><CoffeeIcon /><span>Donate</span></button>
            </div> */}
            <div className={styles.disclamerTxt}>
                Very important :<br />
                - no financial advice here<br />
                - do your own research, always<br />
                - do not trust, verify<br />
                - the cryptocurrency world is full of scammers and thieves, so be extremely careful<br />
                - there is no guarantee of accuracy on this site, particularly on data extracted from the blockchain<br />
                - no responsibility can be engaged (against this site or its creator), as to the use of this site/content and its consequences, in any way
            </div>
            <br />
            <p>Created by <a href="https://twitter.com/jerometomski" target="_blank" rel="noreferrer noopener">Jerome TOMSKI</a>, @2023-{anneeEnCours}</p>
            <br />
        </div>
    );
};

export default Footer;