# image-process-loader

```sh
npm install --save-dev image-process-loader sharp
# or
yarn add -D image-process-loader sharp
```

Image process loader for webpack, powered by [sharp](https://github.com/lovell/sharp)

- supports operations like resizing, cropping, rotation, color manipulation, file type conversation and [lots more](https://sharp.readthedocs.io/)!

- supports JPEG, PNG, WebP, TIFF, GIF and SVG images, but only support output in JPEG, PNG, WebP and TIFF formats

- [sharp](https://github.com/lovell/sharp) is 27x faster than [jimp](https://github.com/oliver-moran/jimp), and 4x faster than [GraphicsMagick](https://github.com/aheckmann/gm) or [ImageMagick](https://github.com/rsms/node-imagemagick) (https://sharp.readthedocs.io/en/stable/performance/)

- only support webpack `2.x` and Node.js `>=6.9` (Welcome PR if you need to use older version)


## Usage

This loader _was not designed to stop you from doing stupid things, because that would also stop you from doing clever things._

You have full access to [sharp API](https://sharp.readthedocs.io/), take a look at their documentation starting from [here](https://sharp.readthedocs.io/en/stable/api-output/#table-of-contents), and know what methods you can call

---

Take an example from [sharp resize](https://sharp.readthedocs.io/en/stable/api-resize/#resize) method. Let's say I want to restrict all image's width to `200px`

In `sharp`
```js
sharp(inputBuffer)
  .resize(200)
  .toBuffer()
```

In `image-process-loader`
```js
/* webpack.config.js */
module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|tiff|webp)$/,
        loader: 'image-process-loader',
        options: {
          resize: 200
        }
      }
    ]
  }
}
```

It is okay to pass multiple arguments, just wrap your option with array.

For example, if I want to resize all images to `width=200px` and `height=300px`
```js
/* webpack.config.js */
module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|tiff|webp)$/,
        loader: 'image-process-loader',
        options: {
          resize: [200, 300]
        }
      }
    ]
  }
}
```

And of course you can pass `sharp`'s Enums
```js
/* webpack.config.js */
const sharp = require('sharp')

module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|tiff|webp)$/,
        loader: 'image-process-loader',
        options: {
          resize: [200, 300, {
            kernel: sharp.kernel.lanczos2,
            interpolator: sharp.interpolator.nohalo
          }]
        }
      }
    ]
  }
}
```

__One important thing to keep in mind, the order of options is exactly the same as the order of processing image__

In `image-process-loader`
```js
/* webpack.config.js */
const sharp = require('sharp')

module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|tiff|webp)$/,
        loader: 'image-process-loader',
        options: {
          crop: sharp.strategy.entropy,
          resize: 200
        }
      }
    ]
  }
}
```

In `sharp`
```js
sharp(inputBuffer)
  .crop(sharp.strategy.entropy)
  .resize(200)
  .toBuffer()
```


## Examples
Convert all images to progressive jpeg
```js
/* webpack.config.js */
module.exports = {
  module: {
    rules: [
      {
        test: /\.(gif|jpe?g|png|svg|tiff|webp)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].jpg'
            }
          },
          {
            loader: 'image-process-loader',
            options: {
              jpeg: {
                progressive: true
              }
            }
          }
        ]
      }
    ]
  }
}
```

Convert all icons to greyscale when in `development` mode
```js
/* webpack.config.js */

const rules = [
  {
    test: /\.png$/,
    loader: 'file-loader',
    options: {
      name: 'img/[name].[ext]'
    }
  }
]

if (process.env.NODE_ENV === 'development') {
  rules.push(
    {
      test: /\/icon.+\.png$/, // assume all icons have `icon` prefix
      loader: 'image-process-loader',
      options: {
        greyscale: true
      }
    }
  )
}

module.exports = {
  module: {
    rules: rules
  }
}
```

Use preset(s) and inline query params

```js
/* webpack.config.js */
module.exports = {
  module: {
    rules: [
      {
        test: /\.(gif|jpe?g|png|svg|tiff|webp)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].jpg'
            }
          },
          {
            loader: 'image-process-loader',
            options: {
              jpeg: {
                progressive: true
              },
              presets: {
                blur: {
                  blur: true,
                  jpeg: {
                    quality: 55,
                  },
                },
                good-quality: {
                  jpeg: {
                    quality: 80,
                  },
                }
              }
            }
          }
        ]
      }
    ]
  }
}
```

```js
require('path/to/image.jpg?preset=blur'); // blur, quality: 55
require('path/to/image.jpg?presets[]=blur&presets[]=good-quality'); // blur, quality: 80; presets order matter
require('path/to/image.jpg?presets[]=good-quality&presets[]=blur'); // blur, quality: 55; presets order matter
require('path/to/image.jpg?{preset:blur,{jpeg:{quality:40}}}'); // blur, quality: 40
```
