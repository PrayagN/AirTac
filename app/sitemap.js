export default function sitemap() {
  const baseUrl = 'https://www.playonmeet.com';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Add more routes here if they exist in the future
  ];
}
