# Deployment (Azure Static Web Apps)

The frontend is deployed to **Azure Static Web Apps** by the GitHub Actions
workflow at
[`.github/workflows/azure-static-web-apps-icy-tree-0e822e610.yml`](../.github/workflows/azure-static-web-apps-icy-tree-0e822e610.yml).

It builds the app in `frontend/` (`app_location: frontend`, `output_location: dist`)
and runs **only on push / PR to `main`**. There is no managed API
(`api_location` is empty) — the Express server in `backend/` is hosted
separately and consumed as an external API.

## ⚠️ Required: the deployment token secret

The deploy step authenticates with a **deployment token** read from a GitHub
Actions secret:

```yaml
azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_ICY_TREE_0E822E610 }}
```

If that secret is missing or empty, **every run fails** at the deploy step with:

```
deployment_token was not provided.
The deployment_token is required for deploying content...
```

When this happens the build never publishes, and the live site keeps serving
whatever was last successfully deployed (it looks "live but never updates").

> **Note on the name:** the secret/workflow are named for the Static Web App
> resource `icy-tree-0e822e610`, but the live site is served from
> `ambitious-ground-04dc9da1e`. These are different resources. The steps below
> wire the **current** app's token into the **existing** secret name so the
> workflow keeps working without renaming anything. (If you'd rather start
> clean, see [Option B](#option-b-re-link-the-app-regenerates-the-workflow).)

## Option A: update the secret (quickest)

1. **Get the deployment token from Azure**
   - Azure Portal → open the Static Web App **`ambitious-ground-04dc9da1e`**.
   - In the **Overview**, click **Manage deployment token**.
   - Copy the token value.

   Or via the Azure CLI:

   ```bash
   az staticwebapp secrets list \
     --name ambitious-ground-04dc9da1e \
     --query "properties.apiKey" -o tsv
   ```

2. **Add/update the GitHub secret**
   - GitHub → repo **Settings → Secrets and variables → Actions**.
   - Under **Repository secrets**, click **New repository secret** (or update
     the existing one).
   - **Name** (must match the workflow exactly):
     `AZURE_STATIC_WEB_APPS_API_TOKEN_ICY_TREE_0E822E610`
   - **Value**: the token from step 1.
   - Save.

3. **Trigger a deploy**
   - Push any commit to `main`, or
   - GitHub → **Actions** → *Azure Static Web Apps CI/CD* → select the latest
     failed run → **Re-run all jobs**.

4. **Verify** the run is green and the live site reflects the new build.

## Option B: re-link the app (regenerates the workflow)

If the `icy-tree` resource is gone and you'd prefer the names to match the live
app:

1. Delete `.github/workflows/azure-static-web-apps-icy-tree-0e822e610.yml`.
2. Azure Portal → **`ambitious-ground-04dc9da1e`** → **Deployment** →
   re-connect the GitHub repository and the `main` branch.
3. Azure commits a new workflow named for `ambitious-ground-...` and creates a
   matching `AZURE_STATIC_WEB_APPS_API_TOKEN_AMBITIOUS_GROUND_...` secret
   automatically.
4. Keep the same build settings: `app_location: frontend`,
   `output_location: dist`, `api_location` empty.

## Build requirements (already configured)

- `vite-plugin-pwa` is declared in `frontend/package.json` and present in
  `frontend/package-lock.json`. It is imported by `frontend/vite.config.js`, so
  the production build fails without it. Keep it in the **frontend** package —
  Azure builds `frontend/` in isolation and does not see the root `package.json`.
