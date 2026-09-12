#!/usr/bin/env bash
# Cria ou atualiza o site de um destino a partir do template bundlado.
#
# Uso:  criar-site.sh <slug> [--forcar]
#
# Criação: copia o template para destinos/<slug>/site/ e aponta os dados para
# o trip.json do destino.
# Atualização: preserva tudo que já existe no site e só repõe o que falta,
# listando ao final os arquivos que divergem do template — um site pode ter
# sido customizado à mão, e sobrescrever isso em silêncio seria destrutivo.
# Use --forcar para repor os arquivos do template mesmo assim.

set -euo pipefail

SLUG="${1:-}"
FORCAR="${2:-}"
[ -z "$SLUG" ] && { echo "uso: criar-site.sh <slug> [--forcar]" >&2; exit 1; }

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE="$AQUI/../assets/template"
RAIZ="$(cd "$AQUI/../../../.." && pwd)"
DESTINO="$RAIZ/destinos/$SLUG"
SITE="$DESTINO/site"
TRIP="$DESTINO/trip.json"

[ -f "$TRIP" ] || { echo "erro: $TRIP não existe. Rode a pesquisa do destino antes." >&2; exit 1; }

novo=0
[ -d "$SITE" ] || novo=1
mkdir -p "$SITE"

divergentes=()
copiar() {
  local rel="$1" origem="$TEMPLATE/$1" alvo="$SITE/$1"
  mkdir -p "$(dirname "$alvo")"
  if [ ! -e "$alvo" ] || [ "$FORCAR" = "--forcar" ]; then
    cp "$origem" "$alvo"
  elif ! cmp -s "$origem" "$alvo"; then
    divergentes+=("$rel")
  fi
}

# src/data/trip.json nunca vem do template: é link para a fonte da verdade.
while IFS= read -r rel; do
  [ "$rel" = "src/data/trip.json" ] && continue
  copiar "$rel"
done < <(cd "$TEMPLATE" && find . -type f -not -path './node_modules/*' -not -path './dist/*' | sed 's|^\./||')

# Link em vez de cópia: assim editar o trip.json do destino já reflete no site,
# sem ninguém precisar lembrar de sincronizar. Onde link simbólico não rola,
# cai para cópia.
mkdir -p "$SITE/src/data"
rm -f "$SITE/src/data/trip.json"
ln -s "../../../trip.json" "$SITE/src/data/trip.json" 2>/dev/null \
  || cp "$TRIP" "$SITE/src/data/trip.json"

# Título e descrição no <head> — é o que aparece na aba e no preview do link.
titulo=$(node -e "process.stdout.write(require('$TRIP').titulo||'Viagem')")
subtitulo=$(node -e "process.stdout.write(require('$TRIP').subtitulo||'')")
node -e "
const fs=require('fs'),p='$SITE/index.html';
let h=fs.readFileSync(p,'utf8');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\"/g,'&quot;');
h=h.replace(/<title>.*<\/title>/,'<title>'+esc(process.argv[1])+'</title>');
h=h.replace(/(<meta name=\"description\" content=\")[^\"]*(\")/,'\$1'+esc(process.argv[2])+'\$2');
fs.writeFileSync(p,h);
" "$titulo" "$subtitulo"

echo "$([ $novo -eq 1 ] && echo 'Site criado' || echo 'Site atualizado'): $SITE"
if [ ${#divergentes[@]} -gt 0 ]; then
  echo
  echo "Preservados (diferentes do template — revise antes de repor com --forcar):"
  printf '  %s\n' "${divergentes[@]}"
fi
echo
echo "Próximo passo:  cd destinos/$SLUG/site && npm install && npm run dev"
