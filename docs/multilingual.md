---
nav_order: 6
permalink: /usage/multilingual
parent: Usage
---

# Multilingual

`Nick` supports multilingual sites. There are two profiles available to use to set this up. The first is `multilingual`, which provides the `languageroot` content type. This can be used to create multiple language roots in your website. For example `/en` for all english pages and `/nl` for all dutch pages. The second profile is `multilingualcontent` which provides example content similar to the `default` profile but the difference is that this profile is creating two language roots; english and dutch.

To setup multilingual support add the following change to your `config.js` file:

```ts
export const config = {
  ...
  profiles: [
    `${__dirname}/src/profiles/core`,
    `${__dirname}/src/profiles/multilingual`,
    `${__dirname}/src/profiles/multilingualcontent`,
  ],
  ...
};
```
