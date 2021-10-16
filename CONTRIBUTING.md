# Contributing

## Developing / Building

### Web
#### Requirements
- Make sure you have [Node.js](https://nodejs.org/).

#### Installing
- Install dependencies in the root folder (using `npm i` or another npm client)
- Install dependencies in the `web` folder

#### Develop
- Run `npm start`

#### Build static html
- Run `npm run build` to generate the static assets. They will be placed in the `web/dist` folder.

### Electron (Desktop Application)
#### Requirements
- Make sure you have [Node.js](https://nodejs.org/).
- Depending on the OS of your computer, you can only build applications for certain OSs.

#### Installing
- Install dependencies in the root folder (using `npm i` or another npm client)
- Install dependencies in the `electron` folder

#### Develop
- Run `npm start`

#### Build static html
- Run `npm run build` to generate the zip file. The output will go somewhere in the `electron/out` folder.


### Android
#### Requirements
- Make sure you have [Node.js](https://nodejs.org/).
- [Android Studio](https://developer.android.com/studio)

#### Installing
- Install dependencies in the root folder (using `npm i` or another npm client)
- Install dependencies in the `android/html` folder

#### Develop
- Run `npm start` in `android/html`
- Run app in Android Studio


#### Building
- Run `npm run build` in `android/html` 
- Generate apk in Android Studio if you want.
