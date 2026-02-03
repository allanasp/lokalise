import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Lokalise Self-Hosted',
  description: 'Self-hosted, open-source translation management platform with OTA updates',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:site_name', content: 'Lokalise Self-Hosted' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/overview' },
      { text: 'SDK', link: '/sdk/react-native' },
      { text: 'GitHub', link: 'https://github.com/allanasp/lokalise' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is Lokalise?', link: '/guide/introduction' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Architecture', link: '/guide/architecture' },
            { text: 'Performance', link: '/guide/performance' },
          ]
        },
        {
          text: 'Installation',
          items: [
            { text: 'Docker Deployment', link: '/guide/installation/docker' },
            { text: 'Local Development', link: '/guide/installation/local' },
            { text: 'Production Setup', link: '/guide/installation/production' },
            { text: 'Environment Variables', link: '/guide/installation/environment' },
          ]
        },
        {
          text: 'Usage',
          items: [
            { text: 'Projects & Organizations', link: '/guide/usage/projects' },
            { text: 'Translation Management', link: '/guide/usage/translations' },
            { text: 'Import & Export', link: '/guide/usage/import-export' },
            { text: 'API Keys', link: '/guide/usage/api-keys' },
          ]
        },
        {
          text: 'Deployment',
          items: [
            { text: 'Docker Compose', link: '/guide/deployment/docker-compose' },
            { text: 'Kubernetes', link: '/guide/deployment/kubernetes' },
            { text: 'Backup & Restore', link: '/guide/deployment/backup' },
            { text: 'Scaling', link: '/guide/deployment/scaling' },
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/overview' },
            { text: 'Authentication', link: '/api/authentication' },
            { text: 'Error Codes', link: '/api/errors' },
          ]
        },
        {
          text: 'Admin API',
          items: [
            { text: 'Projects', link: '/api/admin/projects' },
            { text: 'Locales', link: '/api/admin/locales' },
            { text: 'Translation Keys', link: '/api/admin/keys' },
            { text: 'Translations', link: '/api/admin/translations' },
            { text: 'Import/Export', link: '/api/admin/import-export' },
          ]
        },
        {
          text: 'Public API',
          items: [
            { text: 'Get Translations', link: '/api/public/translations' },
            { text: 'Manifest', link: '/api/public/manifest' },
          ]
        }
      ],
      '/sdk/': [
        {
          text: 'SDK Documentation',
          items: [
            { text: 'React Native', link: '/sdk/react-native' },
            { text: 'Configuration', link: '/sdk/configuration' },
            { text: 'API Reference', link: '/sdk/api-reference' },
            { text: 'Examples', link: '/sdk/examples' },
          ]
        }
      ],
      '/development/': [
        {
          text: 'Development',
          items: [
            { text: 'Contributing', link: '/development/contributing' },
            { text: 'Project Structure', link: '/development/structure' },
            { text: 'Database Migrations', link: '/development/migrations' },
            { text: 'Testing', link: '/development/testing' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/allanasp/lokalise' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Built with Bun, Hono, Nuxt, and Drizzle'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/allanasp/lokalise/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    }
  }
})
