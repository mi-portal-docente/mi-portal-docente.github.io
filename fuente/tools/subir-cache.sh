#!/usr/bin/env bash
# Sube la etiqueta de caché ?v=… en index.html y js/acceso.js (todas a la vez).
# Uso: bash subir-cache.sh <etiqueta>   (p. ej. gp1-20261113)
set -e
cd "$(dirname "$0")/../.."
[ -n "$1" ] || { echo "Falta la etiqueta"; exit 1; }
sed -i -E "s/\?v=[A-Za-z0-9._-]+/?v=$1/g" index.html js/acceso.js
grep -c "?v=$1" index.html js/acceso.js
