# AI-HACCP Platform Makefile

.PHONY: help dev prod stop clean logs test

help: ## Show this help message
	@echo "AI-HACCP Platform Commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

dev: ## Start development environment
	docker-compose up -d
	@echo "🚀 Development environment started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend API: http://localhost:8000"
	@echo "API Docs: http://localhost:8000/docs"

prod: ## Start production environment
	docker-compose -f docker-compose.prod.yml up -d
	@echo "🏭 Production environment started!"

mcp: ## Start with MCP server
	docker-compose --profile mcp up -d
	@echo "🤖 MCP server started for AI integration"

stop: ## Stop all services
	docker-compose down
	docker-compose -f docker-compose.prod.yml down

clean: ## Clean up containers and volumes
	docker-compose down -v
	docker-compose -f docker-compose.prod.yml down -v
	docker system prune -f

logs: ## Show logs for all services
	docker-compose logs -f

logs-api: ## Show API logs
	docker-compose logs -f api

logs-db: ## Show database logs
	docker-compose logs -f postgres

test: ## Run tests
	docker-compose exec api python -m pytest

shell-api: ## Open shell in API container
	docker-compose exec api bash

shell-db: ## Open database shell
	docker-compose exec postgres psql -U postgres -d ai_haccp

backup: ## Backup database
	docker-compose exec postgres pg_dump -U postgres ai_haccp > backup_$(shell date +%Y%m%d_%H%M%S).sql

restore: ## Restore database (usage: make restore FILE=backup.sql)
	docker-compose exec -T postgres psql -U postgres ai_haccp < $(FILE)

build: ## Build all images
	docker-compose build

build-prod: ## Build production images
	docker-compose -f docker-compose.prod.yml build

setup: ## Initial setup with demo data
	docker-compose up -d postgres
	sleep 10
	docker-compose up -d api
	@echo "✅ Setup complete! Demo login: admin@restaurant.com / password"