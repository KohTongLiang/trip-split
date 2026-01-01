Built with svelte kit and supabase with Prisma as the ORM for quick dirty prototyping.

```bash
# Building Container
podman build -t trip-split .

# Running container
podman run -d --replace --name tripsplit --env-file .env -p 3000:3000 trip-split
```