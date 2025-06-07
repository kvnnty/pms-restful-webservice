### SERVER

Run the backend server.
Ensure your `env` in server subdir is setup as shown in `env.example`

```
cd server
pnpm i
pnpm prisma migrate dev
pnpm dev
```


### CLIENT
Run the frontend server.

```
cd client
pnpm i
pnpm dev
```