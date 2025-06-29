{
  "name": "<%= projectName %>",
  "description": "",
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
    "bootstrap": "pnpm install && pnpm migrate && pnpm seed",
    "coverage": "jest --coverage",
    "i18n": "babel-node scripts/i18n.js",
    "i18n:ci": "pnpm i18n && git diff -G'^[^\"POT]' --exit-code",
    "knex": "babel-node --plugins ./src/develop/nick/src/plugins/strip-i18n.js node_modules/knex/bin/cli.js",
    "lint": "./node_modules/eslint/bin/eslint.js --max-warnings=0 'src/**/*.{js,jsx,json}' --no-error-on-unmatched-pattern",
    "migrate": "pnpm knex migrate:latest",
    "preinstall": "if [ -f $(pwd)/node_modules/.bin/missdev ]; then pnpm develop; else pnpm develop:npx; fi",
    "prettier": "./node_modules/.bin/prettier --single-quote --check 'src/**/*.{js,jsx,ts,tsx,json}'",
    "seed": "babel-node src/develop/nick/scripts/seed.js run",
    "seed:status": "babel-node src/develop/nick/scripts/seed.js status",
    "seed:upgrade": "babel-node src/develop/nick/scripts/seed.js upgrade",
    "start": "nodemon --exec babel-node src/develop/nick/src/server.js",
    "rollback": "pnpm knex migrate:rollback --all",
    "reset": "pnpm rollback && pnpm migrate && pnpm seed",
    "test": "jest --passWithNoTests"
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
    "node": "^20 || ^22 || ^23"
  },
  "devDependencies": {},
  "dependencies": {}
}
