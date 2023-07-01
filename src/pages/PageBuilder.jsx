import React from 'react';

import Header from '../elements/Header';
import Footer from '../elements/Footer';

import PageHome from './PageHome/PageHome';
import Page404 from './Page404/Page404';

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
        <>
            <header>{withHeader === "no" ? null : <Header />}</header>
            <main>{renderSwitch(targetPage)}</main>
            <footer>{withFooter === "no" ? null : <Footer />}</footer>
        </>
    );
};

export default PageBuilder;