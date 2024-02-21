# Installation

Follow [react native setup guide](https://reactnative.dev/docs/environment-setup)

Run

```
npm install
npx react-native link
```


## Environment Setup

### Initializing the peach-api submodule

When cloning this repo you will have to run: `git submodule update --init` to initialize the peach-api submodule.


### env files

Copy template for each environment

```
cp .env.dist .env.sandbox
cp .env.dist .env.development
cp .env.dist .env.production
```

Then edit the variables according to your setup



### iOS

Install dependencies

`cd ios && pod install`

### Android

#### Generating Signed APK

https://s-pace.github.io/react-native/docs/signed-apk-android.html

# Run simulator

## iOS

`npm run ios`

To choose specific target
`npm run ios -- --simulator="iPhone SE (3rd generation)"`

Troubles with M1/M2 chips, run:
`arch -x86_64 npm run ios`

## Android

`npm run android`

## Web

`npm run web`

# Test

## Unit testing

`npm run test`

**Run specific tests**
`npm run test ./tests/utils/validationUtils.test.js`

`npm run test ./tests/utils/*.test.js`

## E2E testing

Unit testing is powered by [Detox](https://github.com/wix/Detox)

Follow their guides or this is the quick setup:

### Mac OS X

#### Install `detox-cli`

`npm install -g detox-cli`

#### Install `applesimutils`

```
brew upgrade
brew tap wix/brew
brew install applesimutils
```

### Running E2E Tests

1. Build the app for testing
   `test:e2e:ios:build`
   or
   `test:e2e:android:build`

1. Running tests
   `test:e2e:ios`
   or
   `test:e2e:android`

# Troubleshooting

## Can't build Android

### General

1. Clean gradle

`cd android & ./gradlew clean`

2. Clear metro cache

`npm run cache:clear`

### Error: Duplicate resources

1. Run `rm -rf android/app/src/main/res/drawable-*`
2. Then open folder android in Android Studio and build project
3. Select Build/Generate signed APK to build release

## Can't build iOS

### After react-native updates

1. Install pods

```
npx react-native link
cd ios && pod install
```

## Adding fonts

1. Add fonts to assets/fonts
2. Add font file names in `Info.plist` under `UIAppFonts`

then run

3. `npx react-native-asset`

before building the app

