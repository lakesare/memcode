___can google see site content?
  yes, google now can read ajax.
  use this tool: 'https://www.google.com/webmasters/tools/googlebot-fetch?hl=en&authuser=0&siteUrl=http://www.memcode.com/'
  to see the result of a gogle bot fetch.

  // ___on /courses/:id
  // simple draft - okay
  // simple fetch /api/pages/courses/5 - okay
  // draft + problems = some error, left undisplayed. likely because google bot has old browser and our polyfills don't work.

  I decided to check if user agent is google bot and return plain text then.
