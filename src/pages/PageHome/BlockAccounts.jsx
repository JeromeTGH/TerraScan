import React from 'react';
import { AccountIcon } from '../../application/AppIcons';
import { Link } from 'react-router-dom';
import styles from './BlockAccounts.module.scss';

const BlockAccounts = () => {
    return (
        <div className={styles.accountsContainer}>
            <h2><strong><AccountIcon /></strong><span><strong>Accounts</strong> (notorious)</span></h2>
            → <strong>Burn</strong> address : <Link to="/accounts/terra1sk06e3dyexuq4shw77y3dsv480xv42mq73anxu">terra1sk06e3dyexuq4shw77y3dsv480xv42mq73anxu</Link><br />
            → <strong>Oracle Pool</strong> address : <Link to="/accounts/terra1jgp27m8fykex4e4jtt0l7ze8q528ux2lh4zh0f">terra1jgp27m8fykex4e4jtt0l7ze8q528ux2lh4zh0f</Link><br />  
            → <strong>Binance wallet</strong> main address : <Link to="/accounts/terra18vnrzlzm2c4xfsx382pj2xndqtt00rvhu24sqe">terra18vnrzlzm2c4xfsx382pj2xndqtt00rvhu24sqe</Link><br />
            <br />
            → <strong>Community Pool</strong> address : none (access through API)<br />  
        </div>
    );
};

export default BlockAccounts;