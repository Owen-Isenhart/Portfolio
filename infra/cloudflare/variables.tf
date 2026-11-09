variable "cloudflare_account_id" {
  description = "Cloudflare account that owns the Portfolio zone and tunnel."
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for oisenhart.com."
  type        = string
  sensitive   = true
}
