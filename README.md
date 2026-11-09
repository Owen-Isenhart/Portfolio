
# Portfolio

## About

This is a personal website that serves as a central hub for information about me, my projects, and my notes. The site is designed to be a clean and simple portfolio that was made with a good UX and optimized performance in mind. A Google Lighthouse audit gave it a 100 in performance on desktop, and a 96 on mobile.

## Deployment

The portfolio runs on K3s in a Proxmox VE virtual machine in my homelab.
Cloudflare manages DNS and public HTTPS for `oisenhart.com` and
`www.oisenhart.com`, and a dedicated Cloudflare Tunnel forwards requests to
Traefik in the cluster. GitHub Actions builds and tests the Docker image
and publishes it to GitHub Container Registry.

See the [deployment runbook](docs/DEPLOYMENT.md) for release and operating commands.
