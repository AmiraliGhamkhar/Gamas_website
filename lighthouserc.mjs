export default {
  ci: {
    collect: {
      url: ['http://127.0.0.1:4173/'],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 1 }],
      },
    },
  },
}
