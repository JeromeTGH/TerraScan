import React from 'react';

import styles from './AppBar.module.scss';
import { appName } from '../../application/AppParams';
import { BurgerMenu, SearchIcon } from '../../application/AppIcons';
import { Link } from 'react-router-dom';
import BtnJourNuit from './BtnJourNuit';

const AppBar = () => {

    return (
        <div id={styles["appbar"]}>
            <div id={styles["appbar-leftside"]}>
                <Link to="/">
                    <img src='./terra_luna_classic_logo.png' alt="Terra Luna Classic logo" />
                    <span>{appName}</span>
                </Link>
            </div>
            <div id={styles["appbar-rightside"]}>
                <BurgerMenu />
                <Link to="/search">
                    <SearchIcon />
                </Link>
                <BtnJourNuit />
            </div>
        </div>
    );
};

export default AppBar;