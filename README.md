# Shadcn-UI Template Usage Instructions

## technology stack

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

All shadcn/ui components have been downloaded under `@/components/ui`.

## File Structure

- `index.html` - HTML entry point
- `vite.config.ts` - Vite configuration file
- `tailwind.config.js` - Tailwind CSS configuration file
- `package.json` - NPM dependencies and scripts
- `src/app.tsx` - Root component of the project
- `src/main.tsx` - Project entry point
- `src/index.css` - Existing CSS configuration

## Components

- All shadcn/ui components are pre-downloaded and available at `@/components/ui`

## Styling

- Add global styles to `src/index.css` or create new CSS files as needed
- Use Tailwind classes for styling components

## Development

- Import components from `@/components/ui` in your React components
- Customize the UI by modifying the Tailwind configuration

## Note

The `@/` path alias points to the `src/` directory

## Deploy ke GitHub Pages

1. Pastikan repo sudah ada di GitHub (branch `main`).
2. File workflow sudah disediakan di `.github/workflows/deploy.yml`.
3. Masuk ke Settings → Pages → pilih Source: `GitHub Actions` (kalau belum otomatis).
4. Setiap push ke `main` akan build dan deploy ke Pages.
5. URL akses: `https://<username>.github.io/rri-helpdesk/` (ganti `<username>` sesuai akun).

Jika nama repo berbeda, ubah properti `base` di `vite.config.ts` menyesuaikan: `base: '/nama-repo/'`.

Custom domain: tambahkan file `public/CNAME` lalu isi domain Anda, commit, dan atur DNS (A / CNAME) sesuai dokumentasi GitHub Pages.

# Commands

**Install Dependencies**

```shell
pnpm i
```

**Start Preview**

```shell
pnpm run dev
```

**To build**

```shell
pnpm run build
```
