import React from 'react';

import { chainName, chainID, chainLCDurl, appName} from '../../application/AppParams';

import styles from './SideBar.module.scss';
import { Link, NavLink } from 'react-router-dom';
import { BlocksIcon, ChainIcon, CircleQuestionIcon, ExchangeIcon, HomeIcon, LockIcon, SearchIcon, VoteIcon } from '../../application/AppIcons';
import BtnJourNuit from './BtnJourNuit';

const SideBar = () => {
    return (
        <div id={styles["sidebar"]}>
            <div id={styles["sidebar-title"]}>
                <div id={styles["sidebar-title-text"]}>
                    <Link to="/">
                        <img src='/terra_luna_classic_logo.png' alt="Terra Luna Classic logo" />
                        <span>{appName}</span>
                    </Link>
                </div>
                <div id={styles["sidebar-title-subtext"]}>== A Terra Classic blockchain analyzer ==</div>
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
                        <NavLink to={"/validators"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><BlocksIcon /></span>
                            <span>Validators</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"/blocks"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><ChainIcon /></span>
                            <span>Blocks</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"/transactions"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><ExchangeIcon /></span>
                            <span>Transactions</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"/governance"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><VoteIcon /></span>
                            <span>Governance</span>
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
                        <NavLink to={"/about"} className={({ isActive }) => (isActive ? styles.sidebar_content_mnu_active : styles.sidebar_content_mnu_inactive)}>
                            <span><CircleQuestionIcon /></span>
                            <span>About</span>
                        </NavLink>
                    </li>
                </ul>
                <div className={styles.chainInfos}>
                    {chainName} ({chainID})<br />
                    {chainLCDurl}
                </div>
                <div id={styles["sidebar-theme"]}>
                    Switch theme to →&nbsp;<BtnJourNuit filled="yes" />
                </div>
            </nav>
        </div>
    );
};

export default SideBar;