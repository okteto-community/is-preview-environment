# is-preview-environment

A minimal test application for verifying how Okteto sets the `OKTETO_IS_PREVIEW_ENVIRONMENT` variable across different deployment methods.

## What it does

Deploys a Node.js server that reads `OKTETO_IS_PREVIEW_ENVIRONMENT` (and other Okteto-injected variables) at deploy time and surfaces the values in the running pod. Open the app URL after deploying to see a dashboard showing whether the variable was set and what value it received.

- `/` — HTML dashboard
- `/json` — JSON response
- `/healthz` — health check

## Expected behavior by deployment method

| Method | `OKTETO_IS_PREVIEW_ENVIRONMENT` |
|---|---|
| `okteto deploy` | `false` |
| `okteto pipeline deploy` | `false` |
| Deploy via Okteto UI | `false` |
| `okteto preview deploy` | `true` |

The variable is captured at deploy time via `envsubst` and baked into the pod's environment, so the running app reflects the value that was present when `kubectl apply` ran.

## Usage

```sh
# Regular deploy — expect false
okteto deploy

# Preview deploy — expect true
okteto preview deploy <preview-name> --branch <branch>

# Pipeline deploy — expect false
okteto pipeline deploy
```

## Project structure

```
.
├── okteto.yml          # Okteto manifest (build + deploy + dev)
├── Dockerfile          # Node 18 Alpine image
├── server.js           # Express app
├── package.json
└── k8s/
    ├── deployment.yaml # Passes OKTETO_IS_PREVIEW_ENVIRONMENT into the container
    ├── service.yaml
    └── ingress.yaml    # dev.okteto.com/generate-host auto-assigns a public URL
```