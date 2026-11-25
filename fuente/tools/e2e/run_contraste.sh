#!/usr/bin/env bash
# Contraste del modo oscuro (t173u): plantilla CSS y, con los datos de secciones_e2e, vistas del profesor y del alumno.
# Uso: CONTRASTE_ETAPA=despues bash e2e/run_contraste.sh
# Solo la plantilla (sin emulador): CONTRASTE_SOLO_CSS=1 CONTRASTE_ETAPA=despues node e2e/contraste_oscuro.mjs
set -e
cd "$(dirname "$0")/.."
export JAVA_HOME=${JAVA_HOME:-$(ls -d "$HOME"/jdk/jdk-21* 2>/dev/null | head -1)}; export PATH="$JAVA_HOME/bin:$PATH"
(cd firebase && node prepara-reglas.mjs profe@test.es)
(cd "${SITE:-../..}" && python3 -m http.server 8765 --bind 127.0.0.1 >"${TMPDIR:-/tmp}/http-e2e.log" 2>&1) & HTTP=$!
trap 'kill $HTTP 2>/dev/null || true' EXIT
export CONTRASTE=1
export CONTRASTE_ETAPA=${CONTRASTE_ETAPA:-despues}
export CAPTURAS_OSCURO=${CAPTURAS_OSCURO:-/workspace/capturas-oscuro}
cd firebase && npx firebase emulators:exec --only auth,firestore --project demo-portal "node ../e2e/secciones_e2e.mjs"
