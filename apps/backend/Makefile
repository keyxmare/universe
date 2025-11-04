# Backend Makefile (dynamic help)
# desc: Afficher l'aide backend dynamique
DOCKER ?= docker
DC ?= $(DOCKER) compose -p universe -f $(abspath ../../infra/compose.yaml)
PHP_SERVICE ?= php
.PHONY: help test build install lint

help: # Afficher l'aide backend dynamique
	@echo "\033[35;1mBackend (Symfony API)\033[0m - Help"
	@grep -E '^[a-zA-Z0-9_.%-]+:.*# ' $(MAKEFILE_LIST) | while IFS= read -r line; do \
		target=$${line%%:*}; \
		desc=$${line##*# }; \
		printf "  \033[32m%-20s\033[0m %s\n" "$$target" "$$desc"; \
	done

install: # Installer dépendances composer (backend via container silencieux)
	@$(DC) exec $(PHP_SERVICE) sh -c 'composer install --no-interaction --prefer-dist > /dev/null 2>&1 || echo "Composer install erreur"'

test: # Lancer tests PHPUnit (backend via container)
	@$(DC) exec $(PHP_SERVICE) vendor/bin/phpunit || echo "Tests backend erreur"

clean: # Nettoyer artefacts backend (vendor, cache Symfony)
	@rm -rf vendor var/cache/* var/log/* || true

lint: # Linter + analyse (php-cs-fixer dry-run + phpstan)
	@$(DC) exec $(PHP_SERVICE) sh -c 'vendor/bin/php-cs-fixer fix --dry-run --diff || echo "php-cs-fixer erreurs"'
	@$(DC) exec $(PHP_SERVICE) sh -c 'vendor/bin/phpstan analyse --configuration=phpstan.neon || echo "phpstan erreurs"'

rebuild: # Réinstaller backend (clean + install)
	@$(MAKE) clean install

