import React from 'react';
import { useNavigate } from 'react-router-dom';

import { appName } from '../application/AppParams';
import styles from './SideBar.module.scss';
import { Link, NavLink } from 'react-router-dom';
import { BlocksIcon, CalculatorIcon, CircleQuestionIcon, ExchangeIcon, HomeIcon, LockIcon, SearchIcon, VoteIcon, AccountIcon, BurnIcon, CoffeeIcon } from '../application/AppIcons';
import BtnJourNuit from './BtnJourNuit';

const SideBar = () => {

    const navigate = useNavigate();

    // Fonction de redirection "donate"
    const handleDon = () => {
        navigate('/donate/');
    }

    // Affichage
    return (
        <div id={styles["sidebar"]}>
            <div id={styles["sidebar-title"]}>
                <div id={styles["sidebar-title-text"]}>
                    <Link to="/">
                        <img src='/images/terra_luna_classic_logo.png' alt="Terra Luna Classic logo" />
                        <span>{appName}</span>
                    </Link>
                </div>
            </div>
            <nav id={styles["sidebar-content"]}>
                <ul>
                    <li>
                        <NavLink to={"/"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><HomeIcon /></span>
                            <span>Home</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"/blocks"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><BlocksIcon /></span>
                            <span>Blocks</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"/validators"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><CalculatorIcon /></span>
                            <span>Validators</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"/accounts"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><AccountIcon /></span>
                            <span>Accounts</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"/transactions"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><ExchangeIcon /></span>
                            <span>Transactions</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"/proposals/voting"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><VoteIcon /></span>
                            <span>Governance</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"/burns"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><BurnIcon /></span>
                            <span>Burns</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"/staking"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><LockIcon /></span>
                            <span>Staking</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"/search"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><SearchIcon /></span>
                            <span>Search</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"/about-disclaimer"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><CircleQuestionIcon /></span>
                            <span>About / Disclaimer</span>
                        </NavLink>
                    </li>
                </ul>
                <div id={styles["sidebar-theme"]}>
                    Switch theme to →&nbsp;<BtnJourNuit filled="yes" />
                </div>
                <br />
                <br />
                <div className={styles.don}>
                    Want to help me ?<br />
                    To make this app sustainable ?<br />
                    <button onClick={() => handleDon()}><CoffeeIcon /><span>Donate</span></button><br />
                    So please donate ! Thanks ;)<br />
                </div>
            </nav>
        </div>
    );
};

export default SideBar;