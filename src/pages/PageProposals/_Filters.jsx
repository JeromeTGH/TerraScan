import React from 'react';
import styles from './_Filters.module.scss';
import { NavLink } from 'react-router-dom';

const Filters = () => {
    return (
        <div className={styles.tblFilters}>
            <NavLink to={"/proposals/all"} className={({ isActive }) => (isActive ? styles.selectedFilter : null)}>Show ALL proposals</NavLink>
            <NavLink to={"/proposals/voting"} className={({ isActive }) => (isActive ? styles.selectedFilter : null)}>Show VOTES in progress</NavLink>
            <NavLink to={"/proposals/deposits"} className={({ isActive }) => (isActive ? styles.selectedFilter : null)}>Show PENDING deposits</NavLink>
            <NavLink to={"/proposals/adopted"} className={({ isActive }) => (isActive ? styles.selectedFilter : null)}>Show ADOPTED proposals</NavLink>
            <NavLink to={"/proposals/rejected"} className={({ isActive }) => (isActive ? styles.selectedFilter : null)}>Show REJECTED proposals</NavLink>
        </div>
    );
};

export default Filters;