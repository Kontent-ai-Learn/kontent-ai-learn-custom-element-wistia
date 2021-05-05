![Last modified][last-commit]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

[![Stack Overflow][stack-shield]](https://stackoverflow.com/tags/kentico-kontent)
[![GitHub Discussions][discussion-shield]](https://github.com/Kentico/Home/discussions)

<p align="center">
<image src="docs/kontent.webp" alt="kontent logo" width="300" />
<image src="docs/wistia.png" 
alt="wistia logo" width="300">
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#quick-deploy">Deploy</a> •
  <a href="#configuration">Configuration</a> •
  <a href="#what-is-saved">Saved value</a> •
  <a href="#contributors">Contributors</a> •
  <a href="#license">License</a> •
  <a href="#additional-resources">Resources</a>
</p>

This custom element for [Kentico Kontent](https://kontent.ai) allows users to upload, search & select videos from [wistia](https://www.wistia.com) media projects.

## Features

- Editors can
  - Select projects from Wistia
  - Upload new files
  - Search media files by name
  - Store media id in custom element as value  

## Demo

![Demo Animation][product-demo]

## Quick Deploy

Netlify has made this easy. If you click the deploy button below, it will guide you through the process of deploying it to Netlify and leave you with a copy of the repository in your account as well.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Enngage/kontent-custom-element-wistia)

## Configuration
You will need to add the custom element to a content type filling in the hosted code URL and the following JSON parameters:

```json
{
  "wistiaAccessToken": "<YOUR WISTIA ACCESS TOKEN>"
}
```

## What is Saved

The custom element saves single id of selected media file as string value.


## Contributors
We have collected notes on how to contribute to this project in [CONTRIBUTING.md](CONTRIBUTING.md).

Originally created by [@Enngage](https://github.com/Enngage)

<a href="https://github.com/Enngage/kontent-custom-element-wistia/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Enngage/kontent-custom-element-wistia" />
</a>

## License

[MIT](https://tldrlegal.com/license/mit-license)

## Additional Resources

- [Custom Element Gallery on github](https://kentico.github.io/kontent-custom-element-samples/gallery/)
- [Kentico Kontent's Integration documentation](https://docs.kontent.ai/tutorials/develop-apps/integrate/integrations-overview)
- [Custom Element documentation](https://docs.kontent.ai/tutorials/develop-apps/integrate/content-editing-extensions)
- [Custom Element API reference](https://docs.kontent.ai/reference/custom-elements-js-api)



[last-commit]: https://img.shields.io/github/last-commit/Enngage/kontent-custom-element-wistia?style=for-the-badge
[contributors-shield]: https://img.shields.io/github/contributors/Enngage/kontent-custom-element-wistia.svg?style=for-the-badge
[contributors-url]: https://github.com/Enngage/kontent-custom-element-wistia/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Enngage/kontent-custom-element-wistia.svg?style=for-the-badge
[forks-url]: https://github.com/Enngage/kontent-custom-element-wistia/network/members
[stars-shield]: https://img.shields.io/github/stars/Enngage/kontent-custom-element-wistia.svg?style=for-the-badge
[stars-url]: https://github.com/Enngage/kontent-custom-element-wistia/stargazers
[issues-shield]: https://img.shields.io/github/issues/Enngage/kontent-custom-element-wistia.svg?style=for-the-badge
[issues-url]: https://github.com/Enngage/kontent-custom-element-wistia/issues
[license-shield]: https://img.shields.io/github/license/Enngage/kontent-custom-element-wistia.svg?style=for-the-badge
[license-url]: https://github.com/Enngage/kontent-custom-element-wistia/blob/master/LICENSE
[core-shield]: https://img.shields.io/static/v1?label=&message=core%20integration&style=for-the-badge&color=FF5733
[gallery-shield]: https://img.shields.io/static/v1?label=&message=extension%20gallery&style=for-the-badge&color=51bce0
[stack-shield]: https://img.shields.io/badge/Stack%20Overflow-ASK%20NOW-FE7A16.svg?logo=stackoverflow&logoColor=white&style=for-the-badge
[discussion-shield]: https://img.shields.io/badge/GitHub-Discussions-FE7A16.svg?logo=github&style=for-the-badge
[product-demo]: docs/demo.gif?raw=true
