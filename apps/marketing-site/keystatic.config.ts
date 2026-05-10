import { config, fields, collection, singleton } from '@keystatic/core';

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
  singletons: {
    home: singleton({
      label: 'Home Page',
      path: 'src/content/home',
      format: { data: 'json' },
      schema: {
        heroTitle: fields.text({ label: 'Hero Title' }),
        heroSubtitle: fields.text({ label: 'Hero Subtitle' }),
        splineSceneUrl: fields.text({ 
          label: 'Spline Scene URL', 
          description: 'URL to the exported Spline scene (e.g., https://prod.spline.design/.../scene.splinecode)' 
        }),
      },
    }),
  },
});