import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BlockAccounts.module.scss';
import StyledBox from '../../sharedComponents/StyledBox';

const BlockAccounts = () => {
    return (
        <StyledBox title="Accounts (notorious)" color="blue" className={styles.accountsBlock}>
            → <strong>Burn</strong> address : <Link to="/accounts/terra1sk06e3dyexuq4shw77y3dsv480xv42mq73anxu">terra1sk06e3dyexuq4shw77y3dsv480xv42mq73anxu</Link><br />
            → <strong>Oracle Pool</strong> address : <Link to="/accounts/terra1jgp27m8fykex4e4jtt0l7ze8q528ux2lh4zh0f">terra1jgp27m8fykex4e4jtt0l7ze8q528ux2lh4zh0f</Link><br />  
            → <strong>Binance main wallet</strong> address : <Link to="/accounts/terra18vnrzlzm2c4xfsx382pj2xndqtt00rvhu24sqe">terra18vnrzlzm2c4xfsx382pj2xndqtt00rvhu24sqe</Link> (contains funds owned by Binance and those of its customers)<br />
            <br />
            → <strong>Community Pool</strong> address : shared account <Link to="/accounts/terra1jv65s3grqf6v6jl3dp4t6c9t9rk99cd8pm7utl">here</Link>, but no specific address (access through API, in fact)<br />
        </StyledBox>
    );
};

export default BlockAccounts;