#!/usr/bin/env bash
# Pruebas E2E de las novedades (rama grok-plataforma). FASES=1,2 bash e2e/run_plataforma.sh
set -e
cd "$(dirname "$0")/.."
export JAVA_HOME=${JAVA_HOME:-$(ls -d "$HOME"/jdk/jdk-21* 2>/dev/null | head -1)}; export PATH="$JAVA_HOME/bin:$PATH"
(cd firebase && node prepara-reglas.mjs profe@test.es)
(cd "${SITE:-../..}" && python3 -m http.server 8765 --bind 127.0.0.1 >"${TMPDIR:-/tmp}/http-e2e.log" 2>&1) & HTTP=$!
trap 'kill $HTTP 2>/dev/null || true' EXIT
cd firebase && npx firebase emulators:exec --only auth,firestore --project demo-portal "node ../e2e/plataforma_e2e.mjs"
