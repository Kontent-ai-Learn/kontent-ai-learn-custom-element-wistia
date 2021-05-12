![Last modified][last-commit]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

[![Stack Overflow][stack-shield]](https://stackoverflow.com/tags/kentico-kontent)
[![GitHub Discussions][discussion-shield]](https://github.com/Kentico/Home/discussions)

<p align="center">
<image src="docs/kontent.webp" alt="kontent logo" width="150" />
<image src="docs/wistia.png" 
alt="wistia logo" width="300">
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#quick-deploy">Deploy</a> •
  <a href="#configuration">Configuration</a> •
  <a href="#what-is-saved">Saved value</a> •
  <a href="#development">Development</a> •
  <a href="#contributors">Contributors</a> •
  <a href="#license">License</a> •
  <a href="#additional-resources">Resources</a>
</p>

This custom element for [Kentico Kontent](https://kontent.ai) allows users to upload, search & select videos from [wistia](https://www.wistia.com) media projects.

## Features

-   Editors can
    -   Select projects from Wistia
    -   Upload new files
    -   Search media files by name
    -   Store media id in custom element as value

## Demo

![Demo Animation][product-demo]

## Quick Deploy

Netlify has made this easy. If you click the deploy button below, it will guide you through the process of deploying it to Netlify and leave you with a copy of the repository in your account as well.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Enngage/kontent-custom-element-wistia)

## Configuration

You will need to add the custom element to a content type filling in the hosted code URL and the following JSON parameters:

```json
{
    "wistiaAccessToken": "<YOUR WISTIA ACCESS TOKEN>",
    "wistiaSubdomain": "<YOUR WISTIA SUBDOMAIN>",
    "videoPreviewType": "video | thumbnail", // choose one
    "projectsPerRow": 3, // number of projects per row
    "videosPerRow": 3, // number of videos per row
}
```

## What is Saved

The custom element saves JSON with selected media file as a string.

Example: 

```json
{
   "id":72627052,
   "name":" [Example Video] Wistia Video Essentials",
   "type":"Video",
   "created":"2021-05-04T07:48:43+00:00",
   "updated":"2021-05-04T13:49:00+00:00",
   "duration":214.882,
   "hashed_id":"zjj3nsgyud",
   "description":"",
   "progress":1.0,
   "status":"ready",
   "thumbnail":{
      "url":"https://embed-ssl.wistia.com/deliveries/da5c32cfe2d73b62db603d73cd54164e.jpg?image_crop_resized=200x120",
      "width":200,
      "height":120
   },
   "project":{
      "id":5883712,
      "name":"Richards's first project",
      "hashed_id":"7zn7cu096m"
   },
   "assets":[
      {
         "url":"http://embed.wistia.com/deliveries/933fdcdf0d6e606d4c6cf5d8704e7ad9.bin",
         "width":1920,
         "height":1080,
         "fileSize":397431776,
         "contentType":"video/mp4",
         "type":"OriginalFile"
      },
      {
         "url":"http://embed.wistia.com/deliveries/da5c32cfe2d73b62db603d73cd54164e.bin",
         "width":960,
         "height":540,
         "fileSize":502852,
         "contentType":"image/png",
         "type":"StillImageFile"
      }
   ],
   "transcript":{
      "videoId":"6bedf9f1-d2c0-4873-aded-4deef17fdb27"
   },
   "embedCode":"<EMBED CODE>"
}

```

## Development

This custom element is built with `Angular`. See package.json for scripts regarding building & publishing the library.

## Contributors

We have collected notes on how to contribute to this project in [CONTRIBUTING.md](CONTRIBUTING.md).

Originally created by [@Enngage](https://github.com/Enngage)

<a href="https://github.com/Enngage/kontent-custom-element-wistia/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Enngage/kontent-custom-element-wistia" />
</a>

## License

[MIT](https://tldrlegal.com/license/mit-license)

## Additional Resources

-   [Custom Element Gallery on github](https://kentico.github.io/kontent-custom-element-samples/gallery/)
-   [Kentico Kontent's Integration documentation](https://docs.kontent.ai/tutorials/develop-apps/integrate/integrations-overview)
-   [Custom Element documentation](https://docs.kontent.ai/tutorials/develop-apps/integrate/content-editing-extensions)
-   [Custom Element API reference](https://docs.kontent.ai/reference/custom-elements-js-api)

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
