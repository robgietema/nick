{
  "name": "<%= projectName %>",
  "description": "",
  "type": "module",
  "license": "MIT",
  "version": "0.0.1",
  "private": true,
  "workspaces": [
    "src/develop/nick"
  ],
  "keywords": [
    "cms"
  ],
  "scripts": {
    "develop": "missdev --config=jsconfig.json --fetch-https",
    "develop:npx": "npx -p mrs-developer missdev --config=jsconfig.json --fetch-https",
    "bootstrap": "pnpm preinstall && pnpm install && pnpm migrate && pnpm seed",
    "convert": "tsx scripts/convert.js",
    "i18n": "tsx src/develop/nick/scripts/i18n.js",
    "i18n:ci": "pnpm i18n && git diff -G'^[^\"POT]' --exit-code",
    "knex": "tsx ./node_modules/knex/bin/cli.js",
    "lint": "./node_modules/eslint/bin/eslint.js --max-warnings=0 'src/**/*.{js,jsx,json}'",
    "migrate": "pnpm knex migrate:latest",
    "prettier": "./node_modules/.bin/prettier --single-quote --check 'src/**/*.{js,jsx,ts,tsx,json}'",
    "seed": "tsx src/develop/nick/scripts/seed.js run",
    "seed:status": "tsx src/develop/nick/scripts/seed.js status",
    "seed:upgrade": "tsx src/develop/nick/scripts/seed.js upgrade",
    "start": "nodemon --exec 'tsx src/develop/nick/src/server.ts'",
    "rollback": "pnpm knex migrate:rollback --all",
    "reset": "pnpm rollback && pnpm migrate && pnpm seed",
    "test": "AUTH_RATE_LIMIT=1000 jest --passWithNoTests",
    "preinstall": "if [ -f $(pwd)/node_modules/.bin/missdev ]; then pnpm develop; else pnpm develop:npx; fi"
  },
  "prettier": {
    "trailingComma": "all",
    "singleQuote": true
  },
  "jest": {
    "testPathIgnorePatterns": [
      "/node_modules/",
      "/src/develop"
    ],
    "setupFilesAfterEnv": [
      "./src/develop/nick/jest.setup.js"
    ]
  },
  "engines": {
    "node": "^20 || ^22 || ^23 || ^24"
  },
  "devDependencies": {
    "@babel/core": "7.28.5",
    "@babel/plugin-transform-runtime": "7.28.5",
    "@babel/plugin-proposal-export-default-from": "7.27.1",
    "@babel/preset-env": "7.28.5",
    "@eslint/eslintrc": "3.3.3",
    "@eslint/js": "9.39.2",
    "babel-plugin-add-module-exports": "1.0.4",
    "eslint": "9.39.2",
    "eslint-config-prettier": "10.1.8",
    "eslint-plugin-json": "4.0.1",
    "eslint-plugin-prettier": "5.5.4",
    "jest": "30.2.0",
    "prettier": "3.7.4"
  },
  "dependencies": {
    "@robgietema/nick": "workspace:^",
    "knex": "3.1.0",
    "nodemon": "3.1.11",
    "tsx": "4.21.0"
  }
}
