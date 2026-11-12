#!/usr/bin/env bash
# Capturas de la interfaz con los emuladores:  FASE=antes|despues bash e2e/capturas_ux.sh
set -e
cd "$(dirname "$0")/.."
# Java 21 para los emuladores: usa JAVA_HOME si ya está definido; si no, busca ~/jdk/jdk-21*
export JAVA_HOME=${JAVA_HOME:-$(ls -d "$HOME"/jdk/jdk-21* 2>/dev/null | head -1)}; export PATH="$JAVA_HOME/bin:$PATH"
(cd firebase && node prepara-reglas.mjs profe@test.es)
(cd "${SITE:-../..}" && python3 -m http.server 8765 --bind 127.0.0.1 >"${TMPDIR:-/tmp}/http-e2e.log" 2>&1) & HTTP=$!
trap 'kill $HTTP 2>/dev/null || true' EXIT
cd firebase && npx firebase emulators:exec --only auth,firestore --project demo-portal "node ../e2e/capturas_ux.mjs"
