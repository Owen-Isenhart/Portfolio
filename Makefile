TOFU ?= tofu
KUBECONFIG ?= $(HOME)/.kube/home-k3s.yaml
export TOFU KUBECONFIG

CF_DIR := infra/cloudflare

.PHONY: deploy cloudflared cf-init cf-plan cf-apply verify-public

deploy:
	./scripts/deploy.sh "$(IMAGE)"

cloudflared:
	./scripts/install-cloudflared.sh

cf-init:
	umask 077; "$(TOFU)" -chdir=$(CF_DIR) init

cf-plan:
	umask 077; "$(TOFU)" -chdir=$(CF_DIR) plan -out=portfolio.tfplan

cf-apply:
	umask 077; "$(TOFU)" -chdir=$(CF_DIR) apply portfolio.tfplan

verify-public:
	./scripts/verify-site.sh https://oisenhart.com
	./scripts/verify-site.sh https://www.oisenhart.com
