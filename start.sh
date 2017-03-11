#!/bin/bash
gnome-terminal \
  --tab -e 'npm start' \
  --tab -e 'npm run backend:webpack' \
  --tab -e 'npm run frontend:webpack'
