# Frontend Makefile (dynamic help)
DOCKER ?= docker
DC ?= $(DOCKER) compose -p universe -f $(abspath ../../infra/compose.yaml)
NODE_SERVICE ?= node
.PHONY: help dev build test install

help: # Afficher l'aide frontend dynamique
	@echo "\033[35;1mFrontend (Vue + Vite)\033[0m - Help"
	@grep -E '^[a-zA-Z0-9_.%-]+:.*# ' $(MAKEFILE_LIST) | while IFS= read -r line; do \
		target=$${line%%:*}; \
		desc=$${line##*# }; \
		printf "  \033[32m%-20s\033[0m %s\n" "$$target" "$$desc"; \
	done

VERBOSE ?= 0

install: # Installer dépendances npm (frontend via container (VERBOSE=$(VERBOSE)))
ifeq ($(VERBOSE),1)
	@$(DC) exec $(NODE_SERVICE) sh -c 'npm install --no-audit --no-fund'
else
	@$(DC) exec $(NODE_SERVICE) sh -c 'npm install --no-audit --no-fund > /dev/null 2>&1 || echo "NPM install erreur"'
endif

test: # Lancer tests unitaires (npm run test --silent)
	@$(DC) exec $(NODE_SERVICE) sh -c 'npm run test --silent || echo "Tests frontend erreur"'

clean: # Nettoyer artefacts frontend (node_modules + dist)
	@rm -rf node_modules dist || true

rebuild: # Réinstaller frontend (clean + install + build)
	@$(MAKE) clean install build
