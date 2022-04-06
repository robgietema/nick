# Yeoman Volto App development

### Defensive settings for make:
#     https://tech.davis-hansson.com/p/make/
SHELL:=bash
.ONESHELL:
.SHELLFLAGS:=-xeu -o pipefail -O inherit_errexit -c
.SILENT:
.DELETE_ON_ERROR:
MAKEFLAGS+=--warn-undefined-variables
MAKEFLAGS+=--no-builtin-rules

# Project settings

DIR=$(shell basename $$(pwd))

# Recipe snippets for reuse

# We like colors
# From: https://coderwall.com/p/izxssa/colored-makefile-for-golang-projects
RED=`tput setaf 1`
GREEN=`tput setaf 2`
RESET=`tput sgr0`
YELLOW=`tput setaf 3`


# Top-level targets
.PHONY: all
all: init

.PHONY: init
init:  ## Init
	@echo "Init"
	make init-backend
	make init-frontend

.PHONY: init-backend
init-backend:  ## Init Backend
	@echo "Init Backend"
	(cd api && yarn)

.PHONY: init-frontend
init-frontend:  ## Init React Frontend
	@echo "Init Frontend"
	yarn

.PHONY: build
build:  ## Build
	@echo "Build"
	make build-backend
	make build-frontend

.PHONY: build-backend
build-backend:  ## Build Backend
	@echo "Build Backend"
	(cd api && yarn)

.PHONY: build-frontend
build-frontend:  ## Build React Frontend
	@echo "Build Frontend"
	yarn
	yarn build

.PHONY: start-backend
start-backend:  ## Start React Frontend
	@echo "Start Backend"
	(cd api && yarn start)

.PHONY: start-frontend
start-frontend:  ## Start React Frontend
	@echo "Start Frontend"
	yarn start

.PHONY: test
test:
	make test-backend
	make test-frontend

.PHONY: test-backend
test-backend: ## Run Backend Tests
	@echo "$(GREEN)==> Run Backend Tests$(RESET)"
	(cd api && CI=true yarn test)

.PHONY: test-frontend
test-frontend: ## Run Frontend Tests
	@echo "$(GREEN)==> Run Frontend Tests$(RESET)"
	CI=true yarn test

.PHONY: reset-backend
reset-backend: ## Reset Backend Data
	@echo "Reset Backend Data"
	(cd api && yarn reset)

.PHONY: help
help:		## Show this help.
	@echo -e "$$(grep -hE '^\S+:.*##' $(MAKEFILE_LIST) | sed -e 's/:.*##\s*/:/' -e 's/^\(.\+\):\(.*\)/\\x1b[36m\1\\x1b[m:\2/' | column -c2 -t -s :)"
