# Publicar no VPS

O build é estático (`dist/`), sem servidor de aplicação. Qualquer servidor web
serve, e a configuração abaixo assume um VPS próprio com Caddy ou nginx.

O `vite.config.js` usa `base: './'`, o que faz os caminhos dos assets serem
relativos. Na prática: o mesmo `dist/` funciona na raiz de um domínio e dentro
de uma subpasta, sem rebuild. É o que permite servir várias viagens no mesmo
host sem configurar nada por viagem.

## Uma pasta por viagem

```
/var/www/viagens/
├── index.html          (opcional: lista de viagens)
├── japao-outono-2026/  ← conteúdo de dist/
└── lisboa-maio-2027/
```

```bash
rsync -av --delete destinos/<slug>/site/dist/ \
  usuario@vps:/var/www/viagens/<slug>/
```

`--delete` remove no servidor o que saiu do build. Como o destino é uma pasta
por viagem, o estrago fica contido — mas confira o caminho antes, porque
apontar para `/var/www/viagens/` sem o slug apaga todas as viagens.

## Caddy

```caddyfile
viagens.seudominio.com {
    root * /var/www/viagens
    file_server
    encode gzip zstd

    # Os assets levam hash no nome, então cache longo é seguro.
    @assets path /*/assets/*
    header @assets Cache-Control "public, max-age=31536000, immutable"

    # O HTML não leva hash: cache curto para a atualização aparecer.
    @html path *.html /
    header @html Cache-Control "public, max-age=300"
}
```

Caddy resolve o certificado sozinho. Para deixar a viagem só para quem tem o
link, o caminho mais simples é um slug longo e não adivinhável; se precisar de
verdade, `basic_auth` no bloco.

## nginx

```nginx
server {
    listen 443 ssl http2;
    server_name viagens.seudominio.com;
    root /var/www/viagens;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;

    location ~* /assets/.*\.(js|css|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    location / {
        try_files $uri $uri/ =404;
    }
}
```

Não precisa de fallback para SPA: o site é uma página só, a navegação é por
âncora, e não existe rota de cliente para reescrever.

## Deploy a partir do próprio repo

Se o VPS já tem o repo clonado, dá para pular o rsync:

```bash
git pull
cd destinos/<slug>/site && npm ci && npm run build
cp -r dist/. /var/www/viagens/<slug>/
```

`npm ci` em vez de `npm install` garante que o build no servidor use exatamente
as versões do `package-lock.json` — sem isso um patch de dependência pode
mudar o site entre a sua máquina e o VPS.

## Antes de publicar

O site é público para quem tiver o link. Localizador de reserva, número de
passaporte e telefone pessoal no `trip.json` vão junto. Ou tire esses campos
antes do build, ou proteja a pasta com autenticação — decida conscientemente em
vez de descobrir depois.

## Offline

Uma vez carregado, o site funciona sem rede exceto pelos três blocos ao vivo
(mapa, clima, câmbio), que degradam sozinhos com uma mensagem. Para o roteiro
de bolso sem depender de nada, imprima a página: o CSS de impressão já esconde
navegação e abre todas as seções.
