import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BlockAccounts.module.scss';
import StyledBox from '../../sharedComponents/StyledBox';

const BlockAccounts = () => {
    return (
        <StyledBox title="Accounts (notorious)" color="blue" className={styles.accountsBlock}>
            → <strong>Oracle Pool</strong> address : <Link to="/accounts/terra1jgp27m8fykex4e4jtt0l7ze8q528ux2lh4zh0f">terra1jgp27m8fykex4e4jtt0l7ze8q528ux2lh4zh0f</Link><br />  
            → <strong>Community Pool</strong> address : shared account <Link to="/accounts/terra1jv65s3grqf6v6jl3dp4t6c9t9rk99cd8pm7utl">here</Link>, but no specific address (access through API)<br />
            → <strong>Bonded Tokens Pool</strong> address : <Link to="/accounts/terra1fl48vsnmsdzcv85q5d2q4z5ajdha8yu3nln0mh">terra1fl48vsnmsdzcv85q5d2q4z5ajdha8yu3nln0mh</Link><br />
            → <strong>Unbonding Tokens Pool</strong> address : <Link to="/accounts/terra1tygms3xhhs3yv487phx3dw4a95jn7t7l8l07dr">terra1tygms3xhhs3yv487phx3dw4a95jn7t7l8l07dr</Link><br />
            <br />
            → <strong>Burn</strong> address : <Link to="/accounts/terra1sk06e3dyexuq4shw77y3dsv480xv42mq73anxu">terra1sk06e3dyexuq4shw77y3dsv480xv42mq73anxu</Link><br />
            <br />
            → <strong>Binance main wallet</strong> address : <Link to="/accounts/terra18vnrzlzm2c4xfsx382pj2xndqtt00rvhu24sqe">terra18vnrzlzm2c4xfsx382pj2xndqtt00rvhu24sqe</Link> (contains Binance + its customers funds)<br />
        </StyledBox>
    );
};

export default BlockAccounts;