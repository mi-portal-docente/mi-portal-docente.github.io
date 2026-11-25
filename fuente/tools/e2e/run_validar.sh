#!/usr/bin/env bash
# Pruebas E2E con puertos propios (8391/9401/8776) para no chocar con otros emuladores en la misma máquina.
# FASES=16 bash e2e/run_validar.sh   ·   PRUEBA=aula bash e2e/run_validar.sh
set -e
cd "$(dirname "$0")/.."
export JAVA_HOME=${JAVA_HOME:-$(ls -d "$HOME"/jdk/jdk-21* 2>/dev/null | head -1)}; export PATH="$JAVA_HOME/bin:$PATH"
(cd firebase && node prepara-reglas.mjs profe@test.es)
export E2E_FS_PORT=8391 E2E_AUTH_PORT=9401 E2E_HTTP_PORT=8776 PORTAL_BASE=http://127.0.0.1:8776/index.html
(cd "${SITE:-../..}" && python3 -m http.server 8776 --bind 127.0.0.1 >"${TMPDIR:-/tmp}/http-e2e-validar.log" 2>&1) & HTTP=$!
trap 'kill $HTTP 2>/dev/null || true' EXIT
case "${PRUEBA:-plataforma}" in
  aula) CMD="node ../e2e/aula_e2e.mjs";;
  reglas) CMD="node --test --test-concurrency=1 test/reglas.test.mjs test/aula.test.mjs test/usuarios.test.mjs test/plataforma.test.mjs test/v5.test.mjs";;
  *) CMD="node ../e2e/plataforma_e2e.mjs";;
esac
cd firebase && npx firebase emulators:exec --config firebase.validar.json --only auth,firestore --project demo-portal "$CMD"
