# Portfolio on the homelab

The portfolio runs on K3s in a Proxmox VE virtual machine. Cloudflare
terminates public HTTPS for `oisenhart.com` and `www.oisenhart.com` and
forwards requests through a dedicated tunnel to Traefik. Traefik routes
both hosts to two Next.js pods in the `portfolio` namespace. The connector
and its credentials live in `portfolio-cloudflare`. Both app replicas run
in the same VM on one physical host.

## Route 53 migration reference

Cloudflare now manages both registration and authoritative DNS for
`oisenhart.com`. These steps document the original migration.

1. In Cloudflare, add `oisenhart.com` as a full zone on the Free plan in the
   account that will own the tunnel. In AWS, open **Route 53 → Hosted zones →
   oisenhart.com** and inventory every record. Reproduce all required records
   in Cloudflare, including the Google site verification TXT record and any
   mail, validation, and delegated subdomain records. Use Cloudflare's
   generated apex NS and SOA records. Check Route 53 aliases and routing
   policies separately because they may need equivalent Cloudflare records.
2. Check DNSSEC under **Route 53 → Registered domains → oisenhart.com**.
   The registry reported no DS delegation on November 9, 2026. If a DS has
   since been added, remove it and wait for it to expire before switching.
   Under **Actions → Edit name servers**, replace the four Route 53
   nameservers with the two Cloudflare assigned. Keep the Route 53 hosted
   zone during the migration. Confirm the Cloudflare zone is **Active** and
   verify the preserved records from public resolvers.
3. In **Route 53 → Registered domains → oisenhart.com**, turn off the transfer
   lock if enabled. Use **Transfer out → Transfer to another registrar** to
   obtain the authorization code. Enter it directly in Cloudflare
   **Domain Registration → Transfer Domains**, review and pay the quoted
   fee, and approve any confirmation email. Wait until Cloudflare shows
   itself as registrar.

Public lookups on November 9 found the Google verification TXT at the apex,
no apex A, AAAA, or MX answer, and no `www` A answer. The AWS hosted zone
was the source of record for the migration.

[AWS nameserver instructions](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-name-servers-glue-records.html)

[AWS transfer-out instructions](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-transfer-from-route-53.html)

[Cloudflare Registrar transfer instructions](https://developers.cloudflare.com/registrar/get-started/transfer-domain-to-cloudflare/)

## Prepare operator access

Create a custom API token in Cloudflare **My Profile → API Tokens**. Grant
**Account → Cloudflare Tunnel → Edit** on the account owning the zone and
**Zone → DNS → Edit** and **Zone → Zone Settings → Edit** for
`oisenhart.com` only. Copy
`infra/cloudflare/terraform.tfvars.example` to
`infra/cloudflare/terraform.tfvars` and enter the account and zone IDs from the
Cloudflare zone overview.

Enter the token into a protected local secret store. To use an ignored
operator file from the portfolio repository root:

```bash
bash -c 'umask 077; read -r -s -p "Cloudflare API token: " token &&
  printf "\n" >&2 && test -n "$token" &&
  printf "%s" "$token" > .env.cloudflare-token &&
  chmod 600 .env.cloudflare-token'
```

The operator needs access to GitHub Packages and the cluster through
`~/.kube/home-k3s.yaml`. No inbound router port is required. If using Snap's
OpenTofu and its launcher fails in the sandbox, pass
`TOFU=/snap/opentofu/current/tofu` to the Make targets.

## First release and publication

1. Copy the existing public Giscus settings from the local `.env` to GitHub
   Actions repository variables. The build recognizes
   `NEXT_PUBLIC_GISCUS_REPO`, `NEXT_PUBLIC_GISCUS_REPO_ID`,
   `NEXT_PUBLIC_GISCUS_CATEGORY`, `NEXT_PUBLIC_GISCUS_CATEGORY_ID`, and
   `NEXT_PUBLIC_GISCUS_MAPPING`. If the Giscus repository restricts origins,
   add both HTTPS hostnames. The comments component needs the repository and
   category IDs to enable comments.
2. Push the reviewed release changes to `main`. GitHub Actions builds and
   smoke-tests the production container, publishes it to GHCR, and uploads
   a `portfolio-image` archive to the workflow run.
3. If the package is public, run the digest-based `make deploy` command from
   the workflow summary. For a private package, download the workflow's
   archive and import it on the K3s node. Use the release commit SHA and
   substitute your operator's K3s SSH address and the successful run ID:

   ```bash
   archive_dir="$(mktemp -d)"
   gh run download RUN_ID --name portfolio-image --dir "$archive_dir"
   ssh ops@K3S_IP 'sudo k3s ctr images import --digests -' < "$archive_dir/portfolio-image.tar"
   rm "$archive_dir/portfolio-image.tar"
   rmdir "$archive_dir"
   tag=ghcr.io/owen-isenhart/portfolio:sha-COMMIT_SHA
   digest="$(ssh ops@K3S_IP "sudo k3s ctr images ls 'name==$tag'" | awk 'NR == 2 { print $3 }')"
   image="ghcr.io/owen-isenhart/portfolio@$digest"
   ssh ops@K3S_IP "sudo k3s ctr images tag --force '$tag' '$image'"
   make deploy IMAGE="$image"
   ```

   Verify both replicas are ready. For an internal end-to-end check,
   port-forward Traefik and exercise both virtual hosts:

   ```bash
   kubectl --kubeconfig "$HOME/.kube/home-k3s.yaml" -n kube-system \
     port-forward service/traefik 8080:80
   ```

   ```bash
   SITE_HOST=oisenhart.com ./scripts/verify-site.sh http://127.0.0.1:8080
   SITE_HOST=www.oisenhart.com ./scripts/verify-site.sh http://127.0.0.1:8080
   ```

4. Once Cloudflare is authoritative and the zone is Active, the website can
   launch while the registrar transfer is pending. Inspect existing Cloudflare
   apex and `www` records. Resolve conflicting website A, AAAA, or CNAME records before
   applying the tunnel DNS records. Keep unrelated records, including TXT
   and MX. From the repo root:

   ```bash
   export CLOUDFLARE_API_TOKEN="$(cat .env.cloudflare-token)"
   make cf-init
   make cf-plan
   ```

   Review the saved plan. It should create the portfolio tunnel, its two
   hostname rules with a 404 fallback, the two proxied DNS records, and the HTTPS redirect setting.

   ```bash
   make cf-apply
   unset CLOUDFLARE_API_TOKEN
   make cloudflared
   ```

   Keep a protected backup of the local OpenTofu state and use a single
   operator at a time. State and saved plans can contain the tunnel token.
5. Confirm Universal SSL and Always Use HTTPS are active for both hostnames.
   Enable DNSSEC from Cloudflare
   after the transfer and verify the new DS at the registry. Run
   `make verify-public` from outside the cluster and check the HTTP-to-HTTPS
   redirect separately. Verify that any migrated mail and verification records
   still resolve.

## Later releases

The GitHub workflow publishes each successful main build. Deploy the digest
from its summary or import the run artifact, then run `make verify-public`. A failed rollout restores the
previous image. To roll back a healthy but incorrect release, redeploy a
known-good digest. The image is standalone Next.js with a writable ephemeral
image and route caches, and the cluster pulls the same image that passed the smoke test.
