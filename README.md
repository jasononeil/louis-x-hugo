# Welcome to Remix + Vite!

📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/future/vite) for details on supported features.

## Development

Ensure you're going to use the right version of PNPM:

```
corepack enable
```

Install dependencies:

```
pnpm install
```

Run the Vite dev server:

```shellscript
pnpm run dev
```

Includes [@nanostores/persist](https://github.com/nanostores/persistent) including it's [React integration](https://github.com/nanostores/react) for state management.

## Deployment

First, build your app for production:

```sh
pnpm run build
```

Then run the app in production mode:

```sh
pnpm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `pnpm run build`

- `build/server`
- `build/client`
