

// ==================================================
// Sous-fonction de récupérétation des données ONLINE
// ==================================================
export const getIpfsData = async(ipfsUrlToFetch) => {
  try {
      const res = await fetch(ipfsUrlToFetch).catch(handleError);
      if (res.ok) {
          return res.json();
      } else {
          return Promise.reject(res);
      }    
  } catch(err) {
      return null;
  }
};


// ===========================
// Log les éventuelles erreurs
// ===========================
const handleError = (err) => {
  if(err.response && err.response.data)
      console.warn("err.response.data", err.response.data);
  else
      console.warn("err", err);
}