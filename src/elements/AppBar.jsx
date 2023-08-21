import React from 'react';

import styles from './AppBar.module.scss';
import { appName } from '../application/AppParams';
import { BlocksIcon, BurgerMenu, CalculatorIcon, CircleQuestionIcon, ExchangeIcon, HomeIcon, LockIcon, SearchIcon, VoteIcon, AccountIcon, BurnIcon } from '../application/AppIcons';
import { Link } from 'react-router-dom';
import BtnJourNuit from './BtnJourNuit';

const AppBar = () => {

    const handleBurgerMenuClick = () => {
        const hiddenMenu = document.getElementById(styles["hidden-menu"]);
        hiddenMenu.style.transform = "translateX(100%)";
    }
    
    const hiddenMenuCloseClick = () => {
        const hiddenMenu = document.getElementById(styles["hidden-menu"]);
        hiddenMenu.style.transform = "translateX(-100%)";
    }

    return (
        <div id={styles["appbar"]}>
            <div id={styles["appbar-content"]}>
                <div id={styles["appbar-leftside"]}>
                    <Link to="/">
                        <img src='/terra_luna_classic_logo.png' alt="Terra Luna Classic logo" />
                        <span>{appName}</span>
                    </Link>
                </div>
                <div id={styles["appbar-rightside"]}>
                    <Link to="/search">
                        <SearchIcon />
                    </Link>
                    <BtnJourNuit />
                    <BurgerMenu onClick={() => handleBurgerMenuClick()} />
                </div>
            </div>
            <div id={styles["hidden-menu"]}>
                <div id={styles["hidden-menu-header"]}>
                    <div><strong>App menu</strong> (TerraScan)</div>
                    <button onClick={() => hiddenMenuCloseClick()}>X</button>
                </div>
                <div id={styles["hidden-menu-container"]}>
                    <ul>
                        <li><Link to="/" onClick={() => hiddenMenuCloseClick()}>
                            <span><HomeIcon /></span>
                            <span>Home</span>
                        </Link></li>
                        <li><Link to="/blocks" onClick={() => hiddenMenuCloseClick()}>
                            <span><BlocksIcon /></span>
                            <span>Blocks</span>
                        </Link></li>
                        <li><Link to="/validators" onClick={() => hiddenMenuCloseClick()}>
                            <span><CalculatorIcon /></span>
                            <span>Validators</span>
                        </Link></li>
                        <li><Link to="/accounts" onClick={() => hiddenMenuCloseClick()}>
                            <span><AccountIcon /></span>
                            <span>Accounts</span>
                        </Link></li>
                        <li><Link to="/transactions" onClick={() => hiddenMenuCloseClick()}>
                            <span><ExchangeIcon /></span>
                            <span>Transactions</span>
                        </Link></li>
                        <li><Link to="/proposals" onClick={() => hiddenMenuCloseClick()}>
                            <span><VoteIcon /></span>
                            <span>Governance</span>
                        </Link></li>
                        <li><Link to="/burns" onClick={() => hiddenMenuCloseClick()}>
                            <span><BurnIcon /></span>
                            <span>Burns</span>
                        </Link></li>
                        <li><Link to="/staking" onClick={() => hiddenMenuCloseClick()}>
                            <span><LockIcon /></span>
                            <span>Staking</span>
                        </Link></li>
                        <li><Link to="/search" onClick={() => hiddenMenuCloseClick()}>
                            <span><SearchIcon /></span>
                            <span>Search</span>
                        </Link></li>
                        <li><Link to="/about" onClick={() => hiddenMenuCloseClick()}>
                            <span><CircleQuestionIcon /></span>
                            <span>About</span>
                        </Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AppBar;