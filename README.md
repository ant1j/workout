# Open 7 Minute Workout

Minimalist open-source 7 minute workout app built with React and Vite hosted at [ant1j.github.io/workout](https://ant1j.github.io/workout/).

Choose a workout session (e.g. the classic "Original 7min", or a "Random" session drawing from the exercise library) from the setup screen, along with the rest time and number of sets.

Exercise duration, rest duration and number of sets can be configured via URL parameters, so you can bookmark the URL with the settings you prefer. For example: [ant1j.github.io/workout/?sets=1&duration=30&rest=10](https://ant1j.github.io/workout/?sets=1&duration=30&rest=10)

## Requirements

The app should run on most modern browsers on desktop or mobile (tested on Safari on iOS and Chrome on macOS).

Specifically, your web browser needs to support

- the [Web Speech API](https://caniuse.com/mdn-api_speechsynthesis) for reading out the exercises
- the [Screen Wake Lock API](https://caniuse.com/wake-lock) to prevent the screen from turning off during the workout
- the [URL Search Params](https://caniuse.com/urlsearchparams) to parse the URL parameters

## Development

This project used the React + Vite template to get React working in Vite with HMR and some ESLint rules.

Get started by cloning the repo and running the following commands:

```
$ npm install && npm run dev
```

Other commands:

```
$ npm run lint    # runs eslint
$ npm run format  # runs prettier
$ npm run dist    # builds the app for production
```
