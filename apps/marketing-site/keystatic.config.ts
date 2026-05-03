import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    mentors: collection({
      label: 'Mentors',
      slugField: 'name',
      path: 'src/content/mentors/*',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        role: fields.text({ label: 'Role' }),
        bio: fields.text({ label: 'Bio', multiline: true }),
        avatar: fields.image({
          label: 'Avatar',
          directory: 'src/assets/mentors',
          publicPath: '../../assets/mentors',
        }),
      },
    }),
    testimonials: collection({
      label: 'Testimonials',
      slugField: 'author',
      path: 'src/content/testimonials/*',
      format: { data: 'json' },
      schema: {
        author: fields.slug({ name: { label: 'Author' } }),
        quote: fields.text({ label: 'Quote', multiline: true }),
        jobTitle: fields.text({ label: 'Job Title' }),
      },
    }),
  },
});