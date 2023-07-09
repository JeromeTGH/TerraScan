import React from 'react';

import Header from '../../elements/Header';
import Footer from '../../elements/Footer';

import PageHome from '../PageHome/PageHome';
import PageSearch from '../PageSearch/PageSearch';
import Page404 from '../Page404/Page404';

import styles from './PageBuilder.module.scss';

const PageBuilder = (props) => {

    // Récupération des paramètres d'appel
    const withHeader = props.withHeader;
    const withFooter = props.withFooter;
    const targetPage = props.targetPage;

    // Sélecteur d'affichage
    const renderSwitch = (parametre) => {
        switch(parametre) {
            case '/':
                return <PageHome />;
            case '/search':
                return <PageSearch />;
            case '/404':
                return <Page404 />;
            case undefined:
                return <div>[ERROR] Missing parameter "targetPage" in PageBuilder.jsx</div>;
            default:
                return <div>[ERROR] Unknown page "{parametre}" in PageBuilder.jsx</div>;
        }
    }

    // Affichage
    return (
        <div id={styles["site"]}>
            <div id={styles["sidebar"]}>
                <div id={styles["sidebar-title"]}>
                    Sidebar
                </div>
                <div id={styles["sidebar-content"]}>
                    <div id={styles["sidebar-content-mnu"]}>
                        <br />1
                        <br />2
                        <br />3
                        <br />4
                        <br />5
                        <br />6
                        <br />7
                        <br />8
                        <br />9
                        <br />10
                        <br />11
                        <br />12
                        <br />13
                        <br />14
                        <br />15
                        <br />16
                        <br />17
                        <br />18
                        <br />19
                        <br />20
                        <br />21
                        <br />22
                        <br />23
                        <br />24
                        <br />25
                        <br />26
                        <br />27
                        <br />28
                        <br />29
                        <br />30
                        <br />31
                        <br />32
                        <br />33
                        <br />34
                        <br />35
                        <br />36
                        <br />37
                        <br />38
                        <br />39
                        <br />40
                        <br />41
                        <br />42
                        <br />43
                        <br />44
                        <br />45
                        <br />46
                        <br />47
                        <br />48
                        <br />49
                    </div>
                </div>
            </div>
            <div id={styles["content"]}>
                <header>{withHeader === "no" ? null : <Header />}</header>
                <main>{renderSwitch(targetPage)}</main>
                <footer>{withFooter === "no" ? null : <Footer />}</footer>
            </div>
        </div>
    );
};

export default PageBuilder;