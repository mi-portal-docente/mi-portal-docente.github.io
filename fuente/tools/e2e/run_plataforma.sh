#!/usr/bin/env bash
# Pruebas E2E de las novedades (rama grok-plataforma). FASES=1,2 bash e2e/run_plataforma.sh
set -e
cd "$(dirname "$0")/.."
export JAVA_HOME=${JAVA_HOME:-$(ls -d "$HOME"/jdk/jdk-21* 2>/dev/null | head -1)}; export PATH="$JAVA_HOME/bin:$PATH"
(cd firebase && node prepara-reglas.mjs profe@test.es)
# ALT=1: puertos alternativos (8381/9391/8766) si otro proyecto usa los de siempre en la misma máquina
if [ -n "$ALT" ]; then export E2E_FS_PORT=8381 E2E_AUTH_PORT=9391 E2E_HTTP_PORT=8766; CONF="--config firebase.alt.json"; sed 's/8080/8381/; s/9099/9391/' firebase/firebase.json > firebase/firebase.alt.json; fi
(cd "${SITE:-../..}" && python3 -m http.server ${E2E_HTTP_PORT:-8765} --bind 127.0.0.1 >"${TMPDIR:-/tmp}/http-e2e.log" 2>&1) & HTTP=$!
trap 'kill $HTTP 2>/dev/null || true' EXIT
cd firebase && npx firebase emulators:exec $CONF --only auth,firestore --project demo-portal "node ../e2e/plataforma_e2e.mjs"
