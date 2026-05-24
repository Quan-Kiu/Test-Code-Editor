# Environments — Local MVP

| Environment | Runtime / URL | Purpose | Data class | Release status |
|---|---|---|---|---|
| local development | Vite server on `http://127.0.0.1:4173` | implementation and browser evidence | no stored player data | active |
| local production preview | built Vite assets served locally | packaging smoke when needed | no stored player data | available after build |
| public deployment | not configured | outside bootstrap route | not_applicable | not_run |

The current route has no backend, authentication, secrets, remote API, database or public URL.
