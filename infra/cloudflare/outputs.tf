output "tunnel_id" {
  description = "ID of the dedicated Portfolio Cloudflare Tunnel."
  value       = cloudflare_zero_trust_tunnel_cloudflared.portfolio.id
}

output "cloudflared_token" {
  description = "Sensitive token installed into the portfolio-cloudflare namespace."
  value       = data.cloudflare_zero_trust_tunnel_cloudflared_token.portfolio.token
  sensitive   = true
}
