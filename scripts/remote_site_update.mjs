import { spawnSync } from "child_process"
import { config } from "dotenv"
import { rmSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

// ===============================================
console.log("Étape 1 sur 8 : démarrage du script")
// ===============================================
config({ path: './config/.env' })

const REPERTOIRE_DE_CE_SCRIPT = dirname(fileURLToPath(import.meta.url))
const CHEMIN_VERS_REPERTOIRE_BUILD = join(REPERTOIRE_DE_CE_SCRIPT, "..", "build")
const FTP_URL = process.env.FTP_URL;

// =============================================================
console.log("Étape 2 sur 8 : effacement du répertoire '/build'")
// =============================================================
rmSync(CHEMIN_VERS_REPERTOIRE_BUILD, { recursive: true, force: true })

// ===========================================
console.log("Étape 3 sur 8 : build du projet")
// ===========================================
const exitCode = spawnSync("npm", ["run", "build"], {
    shell: true
});
if(exitCode.status !== 0) {
  console.log('Error', exitCode);
  process.exit(exitCode);
}

// ======================================================================
console.log("Étape 4 sur 8 : mise en mode 'maintenance' du site distant")
// ======================================================================
