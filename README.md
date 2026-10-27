# reduxTest — React Native + Redux Toolkit

A React Native CLI application demonstrating scalable state management, feature-based architecture, navigation, API integration, and automated testing.

## Features

- **Redux Toolkit:** Centralized store with Counter, Authentication, and Users features.
- **Feature-based architecture:** Separates screens, state management, selectors, and navigation.
- **React Navigation:** Native stack navigation and bottom tabs.
- **API integration:** Fetches users from JSONPlaceholder using `createAsyncThunk`.
- **Loading and error handling:** Manages asynchronous request states.
- **Reusable Redux hooks:** Centralizes Redux hook imports.
- **Selectors:** Separates state selection from UI components.
- **Safe-area support:** Uses `react-native-safe-area-context`.
- **Unit tests:** Tests reducers and async thunk behavior with Jest.
- **Continuous integration:** GitHub Actions runs the Jest test suite on pushes and pull requests to `main`.

## Tech Stack

- React Native
- React
- Redux Toolkit
- React Redux
- React Navigation
- Jest
- GitHub Actions

## Project Structure

```text
src/
├── app/
│   ├── store.js
│   └── hooks.js
├── features/
│   ├── counter/
│   │   ├── counterSlice.js
│   │   ├── counterSelectors.js
│   │   └── __tests__/
│   ├── auth/
│   │   ├── authSlice.js
│   │   ├── authSelectors.js
│   │   └── __tests__/
│   └── users/
│       ├── usersSlice.js
│       ├── usersSelectors.js
│       └── __tests__/
├── navigation/
├── screens/
│   ├── CounterScreen.js
│   ├── LoginScreen.js
│   ├── UsersScreen.js
│   └── UserDetailsScreen.js
├── components/
├── services/
└── utils/
```

## Architecture

The application uses a feature-based Redux Toolkit architecture.

1. Screens dispatch actions or asynchronous thunks.
2. Reducers update their respective feature states.
3. Selectors expose state to screens.
4. React Redux subscribes components to relevant state changes.
5. React Navigation manages transitions between screens.

## Getting Started

### Requirements

- Node.js compatible with the project engine requirement (`>=22.11.0`)
- npm
- Xcode for iOS development
- Android Studio for Android development

### Installation

```bash
git clone <https://github.com/MohammadAsadSheikh/reduxTest>
cd reduxTest
npm ci
```

### iOS

```bash
npx pod-install ios
npm start
```

In another terminal:

```bash
npm run ios
```

### Android

Start an Android emulator or connect an Android device, then run:

```bash
npm run android
```

## Testing

Run the complete Jest test suite:

```bash
npm test -- --runInBand
```

The tests cover Counter and Authentication reducers, Users async state transitions, and mocked API thunk behavior.

## Continuous Integration

GitHub Actions runs the Jest test suite on pushes and pull requests targeting `main`.

Workflow file: `.github/workflows/tests.yml`

## Current Limitations

- Authentication is a demonstration using local Redux state; it is not connected to a real authentication backend.
- Users data comes from the public JSONPlaceholder demo API.
- Redux state persistence has not been implemented.

## Future Improvements

- Add form validation and real backend authentication.
- Add secure token handling where authentication is introduced.
- Add pagination and search for users.
- Expand component and integration test coverage.
- Add screenshots and a demonstration video.

## License

Choose and add a license before distributing the project for reuse.
