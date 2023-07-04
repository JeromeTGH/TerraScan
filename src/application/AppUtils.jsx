
// =================================
// Fonction "isValidTransactionHash"
// =================================
/**
 * Permet de tester si la valeur passée en argument est bien d'un format valide ou non, c'est à dire
 * faisant 64 caractères de long, et composée uniquement de chiffres/lettres hexadécimaux (ie, [0-9] [A-F])
 * @param stringToTest Value to test (string)
 */
export const isValidTransactionHash = (stringToTest) => {

    // Teste si la valeur passée fait bien 64 caractères
    if(stringToTest.length !== 64)
        return false;

    // Teste si la valeur passée ne contient que des caractères hexadécimaux
    if(stringToTest.match(/^[0-9a-fA-F]+$/i))
        return true;
    else
        return false;

}