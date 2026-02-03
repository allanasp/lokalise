# Lokalise Self-Hosted Documentation

Official documentation for Lokalise Self-Hosted.

## Development

### Install Dependencies

```bash
npm install
```

### Start Dev Server

```bash
npm run dev
```

Visit http://localhost:5173

### Build for Production

```bash
npm run build
```

Output in `.vitepress/dist`

### Preview Production Build

```bash
npm run preview
```

## Deployment

This documentation is deployed to Vercel. Push to `main` branch to deploy automatically.

### Manual Deployment

```bash
npm run build
vercel --prod
```

## Contributing

To contribute to the documentation:

1. Fork the repository
2. Create a branch (`git checkout -b improve-docs`)
3. Make your changes
4. Test locally (`npm run dev`)
5. Commit and push
6. Create a pull request

## Structure

```
docs/
├── .vitepress/
│   └── config.ts        # VitePress configuration
├── guide/
│   ├── introduction.md
│   ├── getting-started.md
│   └── architecture.md
├── api/
│   ├── overview.md
│   └── admin/
├── sdk/
│   └── react-native.md
└── index.md            # Home page
```

## Credits

Documentation built with [VitePress](https://vitepress.dev).

See [Credits](/credits) for full list of acknowledgments.
