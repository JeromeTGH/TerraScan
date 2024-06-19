import { spawnSync } from "child_process"
import { config } from "dotenv"
import { rmSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import { Client } from "basic-ftp"

// ===============================================
console.log("Étape 1 sur 5 : démarrage du script")
// ===============================================
config({ path: './config/.env' })

const REPERTOIRE_DE_CE_SCRIPT = dirname(fileURLToPath(import.meta.url))
const CHEMIN_VERS_REPERTOIRE_BUILD = join(REPERTOIRE_DE_CE_SCRIPT, "..", "build")
const HOST = process.env.HOST;
const USER = process.env.USER;
const PWD = process.env.PWD;
const SECURE_HOST = process.env.SECURE_HOST;

// =============================================================
console.log("Étape 2 sur 5 : effacement du répertoire '/build'")
// =============================================================
rmSync(CHEMIN_VERS_REPERTOIRE_BUILD, { recursive: true, force: true })

// ===========================================
console.log("Étape 3 sur 5 : build du projet")
// ===========================================
const exitCode = spawnSync("npm", ["run", "old_build"], {
    shell: true
});
if(exitCode.status !== 0) {
  console.log('Error', exitCode);
  process.exit(exitCode);
}

// ==========================================
console.log("Étape 4 sur 5 : opérations FTP")
// ==========================================
console.log("  - Open FTP connexion");
const client = new Client()
// client.ftp.verbose = true
try {
  await client.access({
      host: HOST,
      user: USER,
      password: PWD,
      secure: true,
      secureOptions: {
        host: SECURE_HOST
      }
  })
  
  // Passage en "mode maintenance"
  console.log("  - Rename maintenance file, from OFF to ON");
  await client.rename("maintenance.off", "maintenance.on")
  
  // Suppression des répertoires suivants
  console.log("  - Remove 'images' directory");
  await client.removeDir("images")

  console.log("  - Remove 'static' directory");
  await client.removeDir("static")

  console.log("  - Remove 'asset-manifest.json' file");
  await client.remove("asset-manifest.json")

  console.log("  - Copy new files (from build rep)");
  await client.uploadFromDir(CHEMIN_VERS_REPERTOIRE_BUILD)

  console.log("  - Rename maintenance file, from ON to OFF");
  await client.rename("maintenance.on", "maintenance.off")

}
catch(err) {
  console.log(err)
  client.close()
  process.exit(12);
}

console.log("  - Close FTP connexion");
client.close()


// =========================================
console.log("Étape 5 sur 5 : fin du script")
// =========================================
console.log("");
