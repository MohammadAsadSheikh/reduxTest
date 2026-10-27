# reduxTest — React Native + Redux Toolkit

A React Native CLI application demonstrating feature-based architecture, scalable state management with Redux Toolkit, API integration, navigation, persistent user preferences, and automated testing.

## Features

- **Redux Toolkit:** Centralized state management for Counter, Authentication, and Users features.
- **Feature-based architecture:** Separates application setup, feature logic, selectors, screens, and navigation.
- **React Navigation:** Native stack navigation and bottom-tab navigation.
- **API integration:** Fetches user data from JSONPlaceholder using `createAsyncThunk`.
- **Loading and error handling:** Handles asynchronous request states, failures, retries, and empty results.
- **Search and sorting:** Filters users by name, email, or company and sorts names alphabetically.
- **User details:** Displays information for selected users.
- **Persistent preferences:** Saves notification preferences and compact-list settings using AsyncStorage.
- **Reusable components:** Includes a custom switch component.
- **Safe-area support:** Uses `react-native-safe-area-context`.
- **Automated testing:** Uses Jest to test reducers, selectors/utilities, and asynchronous request behavior.

## Tech Stack

- React Native
- React
- Redux Toolkit
- React Redux
- React Navigation
- AsyncStorage
- Jest
- ESLint
- GitHub Actions, if configured in the repository

## Project Structure

```text
reduxTest/
├── src/
│   ├── app/
│   │   ├── store.js
│   │   └── hooks.js
│   ├── components/
│   │   └── CustomSwitch.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authSlice.js
│   │   │   ├── authSelectors.js
│   │   │   └── __tests__/
│   │   ├── counter/
│   │   │   ├── counterSlice.js
│   │   │   ├── counterSelectors.js
│   │   │   └── __tests__/
│   │   ├── preferences/
│   │   │   └── preferencesStorage.js
│   │   └── users/
│   │       ├── usersSlice.js
│   │       ├── usersSelectors.js
│   │       ├── usersUtils.js
│   │       └── __tests__/
│   ├── navigation/
│   │   ├── AppNavigator.js
│   │   └── MainTabs.js
│   ├── screens/
│   │   ├── AccountScreen.js
│   │   ├── CounterScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── LoginScreen.js
│   │   ├── PreferencesScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── UserDetailsScreen.js
│   │   └── UsersScreen.js
│   └── theme/
│       ├── colors.js
│       └── spacing.js
├── __tests__/
├── App.tsx
└── README.md
```

_Note: Update this tree if your actual repository structure differs._

## Architecture

The application follows a feature-based Redux Toolkit architecture.

1. Screens dispatch Redux actions or asynchronous thunks.
2. Reducers update their respective feature states.
3. Selectors provide state to UI components.
4. React Redux subscribes components to relevant state changes.
5. React Navigation manages screen transitions.
6. AsyncStorage persists user preferences across app restarts.

## Getting Started

### Requirements

- Node.js compatible with the version specified by the project.
- npm
- Xcode and iOS Simulator for iOS development.
- Android Studio and an Android emulator or device for Android development.

Check `package.json` for the exact Node.js engine requirement before choosing a version.

### Installation

```bash
git clone https://github.com/MohammadAsadSheikh/reduxTest.git
cd reduxTest
npm ci
```

### Start Metro

```bash
npm start
```

Keep Metro running while launching the app.

### Run on iOS

Install CocoaPods dependencies if needed:

```bash
cd ios
pod install
cd ..
```

In another terminal, run:

```bash
npm run ios
```

### Run on Android

Start an Android emulator or connect an Android device, then run:

```bash
npm run android
```

## Testing

Run the Jest test suite:

```bash
npm test -- --runInBand
```

Run lint checks:

```bash
npm run lint
```

The tests cover counter and authentication reducers, user state transitions, user utilities, and mocked asynchronous API behavior.

## Continuous Integration

If the GitHub Actions workflow is present at `.github/workflows/tests.yml`, document that it runs the Jest test suite on the configured push and pull-request events.

## Current Limitations

- Authentication is a demonstration using local Redux state; it is not connected to a real authentication backend.
- User data comes from the public JSONPlaceholder API.
- Redux authentication state is not persisted across app restarts.
- The Notifications preference does not enable actual device notifications.
- Privacy & Security is not yet implemented.

## Future Improvements

- Implement backend authentication and form validation.
- Add secure token storage when real authentication is introduced.
- Add pagination for larger user datasets.
- Expand component and integration test coverage.
- Implement the Privacy & Security screen.
- Add screenshots and a demonstration video.

## License

No license has been specified yet. Add a license file before granting others permission to reuse or redistribute the project.
