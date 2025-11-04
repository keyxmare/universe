DOCKER ?= docker
DC := $(DOCKER) compose -p universe -f infra/compose.yaml
PHP_SERVICE ?= php
NODE_SERVICE ?= node

.PHONY: help backend frontend start stop build install up down test logs clean rebuild dev

help: # Afficher l'aide dynamique et déléguer
	@echo "\033[35;1mMonorepo Universe\033[0m - Aide (générée)"
	@echo "\033[36;1mCommandes racine:\033[0m"
	@grep -E '^[a-zA-Z0-9_.%-]+:.*# ' $(MAKEFILE_LIST) | while IFS= read -r line; do \
		target=$${line%%:*}; \
		desc=$${line##*# }; \
		printf "  \033[32m%-20s\033[0m %s\n" "$$target" "$$desc"; \
	done
	@echo ""
	@echo "\033[36;1mSous-projets:\033[0m"
	@for dir in apps/backend apps/frontend; do \
		if [ -f $$dir/Makefile ]; then \
			printf "\n\033[33;1m[$$dir]\033[0m\n"; \
			$(MAKE) -C $$dir help; \
		fi; \
	done

backend: # Déléguer vers backend (usage: make backend <cible>)
	@$(MAKE) -C apps/backend $(filter-out $@,$(MAKECMDGOALS))

frontend: # Déléguer vers frontend (usage: make frontend <cible>)
	@$(MAKE) -C apps/frontend $(filter-out $@,$(MAKECMDGOALS))

up: # Créer/démarrer services + lancer dev frontend (detach)
	@$(DC) up -d

down: # Stop + remove services ($(DC) down)
	@$(DC) down

test: up # Lancer tests backend + frontend (délégation)
	@$(MAKE) -C apps/backend test || echo "Échec tests backend"
	@$(MAKE) -C apps/frontend test || echo "Échec tests frontend"

start: # Démarrer services ($(DC) start)
	@$(DC) start

stop: # Arrêter services ($(DC) stop)
	@$(DC) stop

build: # Construire images ($(DC) build)
	@$(DC) build

VERBOSE ?= 0

install: up # Installer dépendances (backend + frontend via containers, VERBOSE=$(VERBOSE))
	@echo "[backend] install (container)" && $(MAKE) -C apps/backend VERBOSE=$(VERBOSE) install
	@echo "[frontend] install (container)" && $(MAKE) -C apps/frontend VERBOSE=$(VERBOSE) install

logs: # Suivre logs agrégés (-f)
	@$(DC) logs -f --tail=100

clean: # Nettoyer dépendances (vendor + node_modules locaux)
	@echo "[backend] clean vendor" && rm -rf apps/backend/vendor || true
	@echo "[frontend] clean node_modules" && rm -rf apps/frontend/node_modules || true

rebuild: down build up install # Recréer environnement propre
	@echo "Rebuild complet effectué"

