
// =======================================
// Fonction "isValidTransactionHashFormat"
// =======================================

import { tblCorrespondanceValeurs } from "./AppParams";

/**
 * Indique si la valeur passée est oui ou non au format d'un "transaction hash"
 * @param stringToTest Value to test (string)
 */
export const isValidTransactionHashFormat = (stringToTest) => {

    // Teste si la valeur passée ne contient que des caractères hexadécimaux, et fait bien 64 caractères au total
    // (nota : on compare les chaînes entre elles, en majuscule ici, qui est le "standard" pour un transaction hash)
    if(stringToTest.toUpperCase().match(/^[0-9A-F]+$/i) && stringToTest.length === 64)
        return true;
    else
        return false;

}


// ====================================
// Fonction "isValidTerraAddressFormat"
// ====================================

/**
 * Indique si la valeur passée est oui ou non au format d'une adresse Terra Classic
 * @param stringToTest Value to test (string)
 * @param terraAddressHeader Adresse header (ex : "terra1" for accounts, "terravaloper1" for validators, etc)
 */
export const isValidTerraAddressFormat = (stringToTest, terraAddressHeader) => {

    // Différents formats possibles :
    //  - adresse au format "terra1" (44 caractères au total)               <--- adresse de compte standard ("account")
    //  - adresse au format "terrapub1" (47 caractères au total)
    //  - adresse au format "terravaloper1" (51 caractères au total)        <--- adresse d'un validateur ("validator")
    //  - adresse au format "terravaloperpub1" (54 caractères au total)
    //  - adresse au format "terravalcons1" (51 caractères au total)    

    // Les adresses Terra Classic sont donc au format terra[xxx]1[yyy]
    //  - avec 'xxx', une entête spécifique (0 à plusieurs caractères)
    //  - et 'yyy', 38 caractères obligatoires

    const regex = new RegExp('^' + terraAddressHeader.toLowerCase(), 'g');      // On va rechercher tout ce qui commence par terra[...]1[...]
    // (nota : on compare les chaînes entre elles, en minuscule ici, qui est le "standard" pour une adresse terra)

    if(stringToTest.toLowerCase().match(regex) && stringToTest.length === (terraAddressHeader.length + 38))
        return true;

    return false;

}


// =======================================
// Fonction "isValidContractAddressFormat"
// =======================================

/**
 * Indique si la valeur passée est oui ou non au format d'une adresse Terra Classic
 * @param stringToTest Value to test (string)
 */
export const isValidContractAddressFormat = (stringToTest) => {

    // Adresse des contrats au format "terra1", sur 40 à 64 caractères au total
    const terraAddressHeader = "terra1"

    const regex = new RegExp('^' + terraAddressHeader.toLowerCase(), 'g');

    if(stringToTest.toLowerCase().match(regex) && stringToTest.length >= 40 && stringToTest.length <= 64)
        return true;

    return false;

}


// ===================================
// Fonction "isValidBlockNumberFormat"
// ===================================
/**
 * Indique si la valeur passée est oui ou non au format d'un numéro de block Terra Classic
 * @param stringToTest Value to test (string)
 */
export const isValidBlockNumberFormat = (stringToTest) => {

    // Teste si la valeur passée ne contient que des chiffres (en filtrant les chaînes de 64 caractères, correspondant aux "transactions hash")
    if(stringToTest.match(/^[0-9]+$/i) && stringToTest.length !== 64)
        return true;
    else
        return false;

}


// ==========================
// Fonction "formateLeNombre"
// ==========================
/**
 * 
 * @param nbre Valeur à traiter
 * @param sep Séparateur des milliers (virgule, espace, ...)
 * @returns Valeur formatée
 */
export const formateLeNombre = (nbre, sep) => {
    return nbre.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}


// =============================
// Fonction "metEnFormeDateTime"
// =============================
/**
 * 
 * @param valDateTime Valeur à traiter
 * @returns Valeur formatée, de type DD/MM/YYYY HH:MN:SS
 */
export const metEnFormeDateTime = (valDateTime) => {
    // Entrée de la date/time à analyser
    const dateTimeAanalyser = new Date(valDateTime)

    // Récupération des parties qui nous intéresse
    let yyyy = dateTimeAanalyser.getFullYear();
    let mm = dateTimeAanalyser.getMonth() + 1;        // Months start at 0 !
    let dd = dateTimeAanalyser.getDate();
    let hh = dateTimeAanalyser.getHours();
    let mn = dateTimeAanalyser.getMinutes();
    let ss = dateTimeAanalyser.getSeconds();
    
    // Ajout d'un zéro devant certains digits, si nécessaire
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    if (hh < 10) hh = '0' + hh;
    if (mn < 10) mn = '0' + mn;
    if (ss < 10) ss = '0' + ss;
    
    // Retour de la valeur formatée (au format : DD/MM/YYYY HH:MN:SS)
    return dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + mn + ':' + ss;
}


// ================================
// Fonction "metEnFormeGrandNombre"
// ================================
/**
 * 
 * @param nombre nombre réel (donc positif ou négatif, et pas forcément entier)
 * @param precision nombre de chiffres 'n' après la virgule à conserver
 * @param maxSuffixe suffixe (lettre) à ne pas dépasser
 * @returns Valeur formatée avec suffixe (T, B, M, K, ou rien), avec 'n' chiffres après la virgule
 */
export const metEnFormeGrandNombre = (nombre, precision, maxSuffixe = 'T') => {

    if(nombre === undefined)
        return 'undefined';

    const tableauDesUnites = [
        { suffixe: 'T', seuil: 1e12 },
        { suffixe: 'B', seuil: 1e9  },
        { suffixe: 'M', seuil: 1e6  },
        { suffixe: 'K', seuil: 1e3  },
        { suffixe: '',  seuil: 1    }
    ];

    // Recherche du seuil correspondant au maxSuffixe passé en argument (éventuellement forcé)
    const idxUnit = tableauDesUnites.findIndex(valeur => valeur.suffixe === maxSuffixe);
    let maxSeuil = 1;
    if (idxUnit > -1)
        maxSeuil = tableauDesUnites[idxUnit].seuil
    
    // Sélection de la "bonne" ligne dans le tableau des unités
    let selectionDansTableauDesUnites = tableauDesUnites.find((ligne) => Math.abs(nombre) >= ligne.seuil);
    if(selectionDansTableauDesUnites === undefined)
        selectionDansTableauDesUnites = tableauDesUnites[tableauDesUnites.length-1]

    // Changement de ligne dans le tableau des unités, s'il y a une limite imposée en paramètre (maxSuffixe)
    if(selectionDansTableauDesUnites.seuil > maxSeuil)
        selectionDansTableauDesUnites = tableauDesUnites[idxUnit]

    // Et renvoi de la valeur formatée
    if (selectionDansTableauDesUnites)
        return (nombre / selectionDansTableauDesUnites.seuil).toFixed(precision) + (selectionDansTableauDesUnites.suffixe ? ("\u00A0" + selectionDansTableauDesUnites.suffixe) : '') ;  // \u00A0 = &nbsp;
    else  
        return nombre.toFixed(precision);

}


// =================================
// Fonction "metEnFormeGrandNombre2"
// =================================
/**
 * 
 * @param nombre nombre réel (donc positif ou négatif, et pas forcément entier)
 * @param nbChiffresAretourner nombre de chiffres à retourner, supérieur ou égal à 3
 * @param retirerZerosSuperflus retire les zéro à la fin, après la virgule, s'il y en a
 * @returns Valeur formatée avec suffixe (T, B, M, K, ou rien), sur nbChiffres (qu'il y ait une virgule ou pas)
 */
export const metEnFormeGrandNombre2 = (nombre, nbChiffresAretourner, retirerZerosSuperflus = true) => {

    if(nombre === undefined)
        return 'undefined';

    if(Number.isNaN(nombre) || nombre === '...')
        return nombre;

    if(nbChiffresAretourner < 3)
        nbChiffresAretourner = 3

    const tableauDesUnites = [
        { suffixe: 'T', seuil: 1e12 },
        { suffixe: 'B', seuil: 1e9  },
        { suffixe: 'M', seuil: 1e6  },
        { suffixe: 'K', seuil: 1e3  },
        { suffixe: '',  seuil: 1    }
    ];
    
    // Sélection de la "bonne" ligne dans le tableau des unités
    let selectionDansTableauDesUnites = tableauDesUnites.find((ligne) => Math.abs(nombre) >= ligne.seuil);
    if(selectionDansTableauDesUnites === undefined)
        selectionDansTableauDesUnites = tableauDesUnites[tableauDesUnites.length-1]

    // Mise en forme du nombre sur nbChiffres
    const nbreAconsiderer = nombre / selectionDansTableauDesUnites.seuil
    let nbreAretourner
    if(nbreAconsiderer >= 100)
        nbreAretourner = nbreAconsiderer.toFixed(nbChiffresAretourner-3)
    else if(nbreAconsiderer >= 10)
        nbreAretourner = nbreAconsiderer.toFixed(nbChiffresAretourner-2)
    else if(nbreAconsiderer >= 0)
        nbreAretourner = nbreAconsiderer.toFixed(nbChiffresAretourner-1)
    else
        nbreAretourner = nbreAconsiderer.toFixed(nbChiffresAretourner-0)

    // Retrait des zéro à la fin, après la virgule, si souhaité
    if(retirerZerosSuperflus)
        nbreAretourner = nbreAretourner.replace(/(\.[1-9]*)0*$/, '$1')
    nbreAretourner = nbreAretourner.replace(/\.$/, '')

    // Et renvoi de la valeur formatée
    if (selectionDansTableauDesUnites.suffixe)
        return nbreAretourner + "\u00A0" + selectionDansTableauDesUnites.suffixe;       // \u00A0 = &nbsp;
    else       
        return nbreAretourner;

}


// =======================
// Fonction "datetime_ago"
// =======================
/**
 * 
 * @param datetime valeur texte ou timestamp, à comparer au datetime actuel
 * @param reverse valeur qui indique si on veut travailler en "time ago" ou "time later"
 * @returns Valeur texte à afficher
 */
export const datetime_ago = (datetime, reverse=false, disableExtension=false) => {

    // Sélecteur/mise en forme
    let datetimeAanalyser;
    switch (typeof datetime) {
        case 'number':
            break;
        case 'string':
            datetimeAanalyser = new Date(datetime);
            break;
        default:
            datetimeAanalyser = new Date();
    }

    // Variables
    let datetimeInReturn = "";
    let secondsLeft;
    if(reverse)
        secondsLeft = (datetimeAanalyser - new Date()) / 1000;          // Conversion millisecondes → secondes, dans la foulée
    else
        secondsLeft = (new Date() - datetimeAanalyser) / 1000;          // Conversion millisecondes → secondes, dans la foulée

    // Constantes
    const datetime_formats = [
        {nbsecondes: 60, texte: 'seconds', diviseur: 1},
        {nbsecondes: 120, texte: '1 minute ago', diviseur: null},
        {nbsecondes: 3600, texte: 'minutes', diviseur: 60},
        {nbsecondes: 7200, texte: '1 hour ago', diviseur: null},
        {nbsecondes: 86400, texte: 'hours', diviseur: 3600},
        {nbsecondes: 172800, texte: '1 day ago', diviseur: null},
        {nbsecondes: 604800, texte: 'days', diviseur: 86400},
        {nbsecondes: 1209600, texte: '1 week ago', diviseur: null},
        {nbsecondes: 2419200, texte: 'weeks', diviseur: 604800},
        {nbsecondes: 4838400, texte: '1 month ago', diviseur: null},
        {nbsecondes: 29030400, texte: 'months', diviseur: 2419200},
        {nbsecondes: 58060800, texte: '1 year ago', diviseur: null},
        {nbsecondes: 2903040000, texte: 'years', diviseur: 29030400}
    ];

    
    // Logique de calcul
    if (secondsLeft === 0) {
        // Test si le datetime correspond au datetime actuel
        datetimeInReturn = 'Just now';
    } else {
        // Sinon, calcul la différence, entre cette date et maintenant
        for(let index = 0 ; index < datetime_formats.length ; index++) {
            if(secondsLeft < datetime_formats[index].nbsecondes) {
                if(datetime_formats[index].diviseur === null) {
                    datetimeInReturn = datetime_formats[index].texte;
                    break;
                } else {
                    datetimeInReturn = Math.floor(secondsLeft / datetime_formats[index].diviseur) + ' ' + datetime_formats[index].texte + ' ago';
                    break;
                }
            }
        }
    }

    // Traitement de sortie
    if(disableExtension) {
        datetimeInReturn = datetimeInReturn.replace(' ago', '');
        datetimeInReturn = datetimeInReturn.replace('ago', '');
    }
    if(reverse) {
        datetimeInReturn = datetimeInReturn.replace('ago', 'from now');
    }

    // Renvoi du texte formaté
    return datetimeInReturn.replaceAll(' ', '\u00a0');
}



// ========================================
// Fonction "metEnFormeAmountPartieEntiere"
// ========================================
/**
 * 
 * @param amount Valeur à traiter
 * @param sep Séparateur des milliers (virgule, espace, ...)
 * @returns Valeur avec partie entière formatée
 */
export const metEnFormeAmountPartieEntiere = (amount, sep = ',') => {
    if(amount === undefined || amount === '')
        return '';

    const partieEntiere = parseInt(amount);
    const partieEntiereFormatee = partieEntiere.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    return partieEntiereFormatee;
}
// =======================================
// Fonction "retournePartieDecimaleFixed6"
// =======================================
/**
 * 
 * @param amount Valeur à traiter
 * @returns Valeur avec partie décimale formatée (6 chiffres "après la virgule")
 */
export const retournePartieDecimaleFixed6 = (amount) => {
    if(amount === undefined || amount === '')
        return '';

    const partieDecimale = amount % 1;
    const partieDecimaleFormatee = partieDecimale.toFixed(6).replace('0.', '.');
    // const partieDecimaleFormatee = partieDecimale === 0 ? '' : partieDecimale.toFixed(6).replace('0.', '.');
    return partieDecimaleFormatee;
}



// ================================
// Fonction "expanded_datetime_ago"
// ================================
/**
 * 
 * @param datetime valeur texte ou timestamp, à comparer au datetime actuel
 * @param reverse valeur qui indique si on veut travailler en "time ago" ou "time later"
 * @returns Valeur texte à afficher
 */
export const expanded_datetime_ago = (datetime, reverse=false, referenceDatetime = new Date()) => {

    // Formatage de la date d'entrée, au besoin
    let datetimeAanalyser;
    switch (typeof datetime) {
        case 'number':
            break;
        case 'string':
            datetimeAanalyser = new Date(datetime);
            break;
        default:
            datetimeAanalyser = new Date();
    }

    
    // Calcul du nombre de secondes d'écart, entre la date passée en argument, et maintenant
    let differenceInSeconds;
    if(reverse)
        differenceInSeconds = (datetimeAanalyser - referenceDatetime) / 1000;          // Conversion millisecondes → secondes, dans la foulée
    else
        differenceInSeconds = (referenceDatetime - datetimeAanalyser) / 1000;          // Conversion millisecondes → secondes, dans la foulée


    // Définition de la structure de sortie
    const structureDeSortie = {
        premierNombre: null,
        premierLibelle: null,
        secondNombre: null,
        secondLibelle: null
    }


    // Jalons
    const datetime_milestones = [
        {nbsecondes: 3600 * 24 * 365, unit: 'year'},    // 1 an = 3600 secondes par heure, 24h par jour, et 365 jours par an (environ)
        {nbsecondes: 3600 * 24 * 30, unit: 'month'},    // 1 mois = 3600 secondes par heure, 24h par jour, et 30 jours par mois (environ)
        {nbsecondes: 3600 * 24 * 7, unit: 'week'},      // 1 semaine = 3600 secondes par heure, 24h par jour, et 7 jours par semaine
        {nbsecondes: 3600 * 24, unit: 'day'},           // 1 jour = 3600 secondes par heure, et 24h par jour
        {nbsecondes: 3600, unit: 'hour'},               // 1 heure = 3600 secondes par heure
        {nbsecondes: 60, unit: 'minute'}                // 1 minute = 60 secondes par minute
    ]


    // Exploration des différents cas
    let premierNombreFound = false;
    let differenceInSecondsRestant = differenceInSeconds;

    for(let index = 0 ; index < datetime_milestones.length ; index++) {
        if(differenceInSecondsRestant > datetime_milestones[index].nbsecondes) {
            let nbUnit = parseInt(differenceInSecondsRestant / datetime_milestones[index].nbsecondes);
            if(!premierNombreFound) {
                structureDeSortie.premierNombre = nbUnit;
                structureDeSortie.premierLibelle = datetime_milestones[index].unit + (nbUnit > 1 ? 's' : '');
                differenceInSecondsRestant -= nbUnit * datetime_milestones[index].nbsecondes;
                premierNombreFound = true;
            } else {
                structureDeSortie.secondNombre = nbUnit;
                structureDeSortie.secondLibelle = datetime_milestones[index].unit + (nbUnit > 1 ? 's' : '');
                break;
            }
        }
    }


    // Traitement de sortie
    let chaineAretourner;
    if(structureDeSortie.premierNombre !== null) {
        chaineAretourner = structureDeSortie.premierNombre + '\u00a0' + structureDeSortie.premierLibelle;
        if(structureDeSortie.secondNombre !== null)
            chaineAretourner += ' and ' + structureDeSortie.secondNombre + '\u00a0' + structureDeSortie.secondLibelle;
    } else {
        chaineAretourner = 'less than a\u00a0minute';
    }


    // Renvoi du texte formaté
    return chaineAretourner;
}



// ================================
// Fonction "coinsListToLinearText"
// ================================
/**
 * 
 * @param coinsList array of coins
 * @returns texte amount+denom, avec des virgules de séparation si plusieurs coins dans la liste
 */
export const coinsListToLinearText = (coinsList, bShowExoticsCoins = false) => {

    // Si liste absente, on quitte
    if(coinsList === undefined)
        return '';

    // Si liste vide, on quitte
    if(coinsList.length === 0)
        return '';


    // Exploration de la liste fournie
    let texteAretourner = "";    
    for(const coin of coinsList) {
        const amount = (coin.amount/1000000).toFixed(6);
        const denom = tblCorrespondanceValeurs[coin.denom] ? tblCorrespondanceValeurs[coin.denom] : bShowExoticsCoins ? coin.denom : '';
        if(texteAretourner !== "")
            texteAretourner += ", ";
        texteAretourner += (amount + "\u00a0" + denom);
    }

    return texteAretourner;
}



// =========================
// Fonction "truncateString"
// =========================
/**
 * 
 * @param chaineDeCaracteres chaîne de caractère à tronquer, au besoin
 * @param nbMaxCaracteres nombre maxi de caractères à garder
 * @returns 
 */
export function truncateString(chaineDeCaracteres, nbMaxCaracteres) {
    if (chaineDeCaracteres.length <= nbMaxCaracteres)
        return chaineDeCaracteres;
    else
        return chaineDeCaracteres.slice(0, nbMaxCaracteres) + '...';
}
 


// =================
// Fonction "Urlify"
// =================
/**
 * 
 * @param text chaîne de caractère à analyser
 * @returns texte traité, avec hyperlink(s) dedans
 */
export const Urlify = ({ text }) => {

  const regex_pour_url = /(https?:\/\/[^\s]+)/g;

  return (
    <>
      {text.split(regex_pour_url).map((segment, index) => {
        const match = segment.match(regex_pour_url);
        if (match)
          return (<a key={index} href={match} target="_blank" rel="noreferrer noopener">{match}</a>);
        else
          return segment;
      })}
    </>
  );

};