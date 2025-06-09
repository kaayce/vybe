.PHONY: up up-dev down down-dev build clean help

# Prod
up:
	@echo "🚀 Starting production (server + client + redis)..."
	COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose up -d --build

down:
	@echo "🛑 Stopping production..."
	docker compose down --remove-orphans

# Dev
up-dev:
	@echo "🔧 Starting development Redis..."
	docker compose -f docker-compose.dev.yml up -d redis
	@echo "💡 Run client and server with: pnpm dev"

down-dev:
	@echo "🛑 Stopping development services..."
	docker compose -f docker-compose.dev.yml down --remove-orphans

# Build
build:
	@echo "🔧 Building client and server..."
	pnpm build

# Cleanup
clean:
	@echo "🧹 Cleaning up Docker + artifacts..."
	docker compose down -v --remove-orphans
	docker compose -f docker-compose.dev.yml down -v --remove-orphans
	rm -rf packages/server/{dist,build} packages/client/dist
	@echo "✅ Cleanup complete."


# Help
help:
	@echo "App Makefile Commands:"
	@echo ""
	@echo "  up           🚀  Start production stack"
	@echo "  down         🛑  Stop production stack"
	@echo "  up-dev       🔧  Start Redis for dev"
	@echo "  down-dev     🛑  Stop dev services"
	@echo "  build        🔨  Build both client and server"
	@echo "  clean        🧹  Clean up builds and containers"
	@echo "  help         📖  Show this message"
