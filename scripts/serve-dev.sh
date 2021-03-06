RELOAD_PORT=3000

cross-env fast-live-reload --serve http://localhost:$RELOAD_PORT --delay 1500 --add-path constrollers --add-path middleware --add-path src --add-path public --add-path views &
cross-env NODE_ENV=development nodemon --ext js,ejs,css,svg,png,jpg,mp4,ico,json,xml --watch controllers --watch middleware --watch src --watch public --watch views src/index.js
