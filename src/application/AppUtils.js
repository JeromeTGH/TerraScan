
// =======================================
// Fonction "isValidTransactionHashFormat"
// =======================================
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
    // AJOUT :
    //  - adresse au format "terra1" (64 caractères au total)               <--- adresse de contrat ("contract")
    

    // Les adresses Terra Classic sont donc au format terra[xxx]1[yyy]
    //  - avec 'xxx', une entête spécifique (0 à plusieurs caractères)
    //  - et 'yyy', 38 caractères obligatoires

    const regex = new RegExp('^' + terraAddressHeader.toLowerCase(), 'g');      // On va rechercher tout ce qui commence par terra[...]1[...]
    // (nota : on compare les chaînes entre elles, en minuscule ici, qui est le "standard" pour une adresse terra)

    if(stringToTest.toLowerCase().match(regex) && stringToTest.length === (terraAddressHeader.length + 38))
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


// =============================
// Fonction "metEnFormeDateTime"
// =============================
/**
 * 
 * @param nombre nombre réel (donc positif ou négatif, et pas forcément entier)
 * @param precision nombre de chiffres 'n' après la virgule à conserver
 * @returns Valeur formatée avec suffixe (T, B, M, K, ou rien), avec 'n' chiffres après la virgule
 */
export const metEnFormeGrandNombre = (nombre, precision) => {

    if(nombre === undefined)
        return 'undefined';

    const tableauDesUnites = [
        { suffixe: 'T', seuil: 1e12 },
        { suffixe: 'B', seuil: 1e9  },
        { suffixe: 'M', seuil: 1e6  },
        { suffixe: 'K', seuil: 1e3  },
        { suffixe: '',  seuil: 1    }
    ];
  
    const seuilLePlusGrandPourCeNombre = tableauDesUnites.find((ligne) => Math.abs(nombre) >= ligne.seuil);

    if (seuilLePlusGrandPourCeNombre)
        return (nombre / seuilLePlusGrandPourCeNombre.seuil).toFixed(precision) + (seuilLePlusGrandPourCeNombre.suffixe ? ("\u00A0" + seuilLePlusGrandPourCeNombre.suffixe) : '') ;  // \u00A0 = &nbsp;
    else  
        return nombre.toFixed(precision);

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
export const datetime_ago = (datetime, reverse=false) => {

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
        {nbsecondes: 172800, texte: 'Yesterday', diviseur: null},
        {nbsecondes: 604800, texte: 'days', diviseur: 86400},
        {nbsecondes: 1209600, texte: 'Last week', diviseur: null},
        {nbsecondes: 2419200, texte: 'weeks', diviseur: 604800},
        {nbsecondes: 4838400, texte: 'Last month', diviseur: null},
        {nbsecondes: 29030400, texte: 'months', diviseur: 2419200},
        {nbsecondes: 58060800, texte: 'Last year', diviseur: null},
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

    if(reverse) {
        datetimeInReturn = datetimeInReturn.replace('ago', 'from now'); 
        datetimeInReturn = datetimeInReturn.replace('Last', 'Next'); 
        datetimeInReturn = datetimeInReturn.replace('Yesterday', 'Tomorrow'); 
    }

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
    const partieDecimale = amount % 1;
    const partieDecimaleFormatee = partieDecimale.toFixed(6).replace('0.', '.');
    // const partieDecimaleFormatee = partieDecimale === 0 ? '' : partieDecimale.toFixed(6).replace('0.', '.');
    return partieDecimaleFormatee;
}
