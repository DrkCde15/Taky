#!/usr/bin/env bash
set -e

echo "==> Instalando Node.js via nvm..."
export NVM_DIR="$HOME/.nvm"
if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
fi
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 22
nvm use 22

echo "==> Build frontend..."
cd ../frontend
npm install --no-audit --no-fund
npm run build
cd ../backend

echo "==> Instalando dependencias Python..."
pip install -r requirements.txt
