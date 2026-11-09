resource "cloudflare_zero_trust_tunnel_cloudflared" "portfolio" {
  account_id = var.cloudflare_account_id
  name       = "portfolio-home-k3s"
  config_src = "cloudflare"
}

data "cloudflare_zero_trust_tunnel_cloudflared_token" "portfolio" {
  account_id = var.cloudflare_account_id
  tunnel_id  = cloudflare_zero_trust_tunnel_cloudflared.portfolio.id
}

locals {
  domain = "oisenhart.com"

  public_hostnames = toset([local.domain, "www.${local.domain}"])

  traefik_service = "http://traefik.kube-system.svc.cluster.local:80"
}

resource "cloudflare_dns_record" "website" {
  for_each = local.public_hostnames

  zone_id = var.cloudflare_zone_id
  name    = each.value
  type    = "CNAME"
  content = "${cloudflare_zero_trust_tunnel_cloudflared.portfolio.id}.cfargotunnel.com"
  ttl     = 1
  proxied = true
}

resource "cloudflare_zero_trust_tunnel_cloudflared_config" "portfolio" {
  account_id = var.cloudflare_account_id
  tunnel_id  = cloudflare_zero_trust_tunnel_cloudflared.portfolio.id

  config = {
    ingress = concat([
      for hostname in sort(tolist(local.public_hostnames)) : {
        hostname = hostname
        service  = local.traefik_service
      }
      ], [
      {
        service = "http_status:404"
      }
    ])
  }
}

resource "cloudflare_zone_setting" "always_use_https" {
  zone_id    = var.cloudflare_zone_id
  setting_id = "always_use_https"
  value      = "on"
}
