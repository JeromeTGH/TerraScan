
export const calculateNextEpochDateTime = (lastblockInfos) => {

    // Tableau à retourner
    const tblAretourner = {};
    
    // Paramètres de calcul
    const nbBlocksPerEpoch = 100800;        // Sur la base de 100 800 block par epoch
    const nbSecondsPerBlock = 6;            // Sur la base "moyenne" d'un nouveau bloc toutes les 6 secondes

    // Récupération des données qui nous intéresse ici
    const lastBlockHeight = lastblockInfos.height;
    const lastBlockDateTime = lastblockInfos.datetime;

    // Calculs (pour retrouver le n° de l'epoch en cours, le % d'avancement dans celle-ci, et la date de la prochaine)
    const estimatedCurrentEpoch = parseInt(lastBlockHeight/nbBlocksPerEpoch);
    const pourcentageAvancementDansEpoch = ((lastBlockHeight % nbBlocksPerEpoch)/nbBlocksPerEpoch*100).toFixed(1);
    const estimatedNbSecondsLeftUntilNextEpoch = ((estimatedCurrentEpoch+1)*nbBlocksPerEpoch - lastBlockHeight)*nbSecondsPerBlock;
    const dateTimeLastBlock = new Date(lastBlockDateTime);
    const estimatedNextEpochStart = new Date(dateTimeLastBlock.getTime() + estimatedNbSecondsLeftUntilNextEpoch*1000);  // *1000 pour conversion sec => millisecondes

    // Insertion des valeurs dans le tableau
    tblAretourner['LastBlockHeight'] = lastBlockHeight;
    tblAretourner['LastBlockEpoch'] = estimatedCurrentEpoch;
    tblAretourner['PourcentageAvancementDansEpoch'] = pourcentageAvancementDansEpoch;
    tblAretourner['DateEstimativeProchaineEpoch'] = estimatedNextEpochStart.toLocaleString();
    
    // Et renvoi du tableau rempli
    return tblAretourner;

}
