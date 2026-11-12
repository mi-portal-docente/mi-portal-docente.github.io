#!/usr/bin/env bash
# Compila los 8 proyectos ESP32 (codigo/P*/) y deja en firmware/ (raíz de la web)
# un binario fusionado por proyecto (se graba en 0x0) y manifest.json.
# Requiere arduino-cli con el core esp32:esp32 y las librerías de los proyectos.
set -euo pipefail
export PATH="$HOME/bin:$PATH"
SITE=${SITE:-$(cd "$(dirname "$0")/../.." && pwd)}
OUT=$SITE/firmware; TMP=$(mktemp -d)
mkdir -p "$OUT"
CORE=$(arduino-cli core list | awk '/esp32:esp32/{print $2}')
for d in "$SITE"/codigo/P*/; do
  n=$(basename "$d"); id=$(echo "$n" | sed -E 's/^P([0-9]).*/p\1/')
  # --build-path (sin --output-dir): no deja carpetas «build» dentro de codigo/
  arduino-cli compile --fqbn esp32:esp32:esp32 --build-path "$TMP/$n" "$d" >/dev/null
  python3 - "$TMP/$n/$n.ino.merged.bin" "$OUT/$id.bin" <<'PY'
import sys
d=open(sys.argv[1],'rb').read()
end=len(d.rstrip(b'\xff')); end=(end+0xfff)//0x1000*0x1000
open(sys.argv[2],'wb').write(d[:end])
PY
done
python3 - "$OUT" "$CORE" <<'PY'
import sys,json,hashlib,os,glob,re
out,core=sys.argv[1],sys.argv[2]
def info(p):
    b=open(p,'rb').read(); return len(b),hashlib.sha256(b).hexdigest()
proj=[]
for p in sorted(glob.glob(out+'/p[1-8].bin')):
    t,h=info(p); proj.append({'id':os.path.basename(p)[:-4],'archivo':os.path.basename(p),'direccion':0,'tam':t,'sha256':h})
m={'chip':'ESP32','core':'arduino-esp32 '+core,'proyectos':proj}
json.dump(m,open(out+'/manifest.json','w'),indent=1,ensure_ascii=False)
print(json.dumps(m,indent=1))
PY
rm -rf "$TMP"
