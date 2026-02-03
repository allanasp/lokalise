# React Native SDK

The official React Native SDK for Lokalise Self-Hosted provides OTA translation updates, offline caching, and a simple React hooks API.

## Installation

```bash
npm install @lokalise/sdk-react @react-native-async-storage/async-storage
```

Or with yarn:
```bash
yarn add @lokalise/sdk-react @react-native-async-storage/async-storage
```

## Basic Setup

### 1. Wrap Your App

```tsx
import { LokaliseProvider } from "@lokalise/sdk-react";

export default function App() {
  return (
    <LokaliseProvider
      apiKey="lok_your_project_api_key"
      baseUrl="https://your-lokalise-server.com"
      defaultLocale="en"
      namespaces={["default"]}
    >
      <YourApp />
    </LokaliseProvider>
  );
}
```

### 2. Use Translations

```tsx
import { useTranslation } from "@lokalise/sdk-react";
import { View, Text } from "react-native";

function MyScreen() {
  const { t } = useTranslation("default");

  return (
    <View>
      <Text>{t("welcome.message")}</Text>
      <Text>{t("user.greeting", { name: "John" })}</Text>
    </View>
  );
}
```

## Configuration

### LokaliseProvider Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `apiKey` | `string` | Yes | - | Project API key from settings (starts with `lok_`) |
| `baseUrl` | `string` | Yes | - | URL to your Lokalise instance |
| `defaultLocale` | `string` | Yes | - | Default language code (e.g., `"en"`) |
| `namespaces` | `string[]` | Yes | - | Translation namespaces to load |
| `pollInterval` | `number` | No | `30000` | How often to check for updates (ms) |
| `locale` | `string` | No | `defaultLocale` | Initial locale (overrides default) |
| `fallbackLocale` | `string` | No | `defaultLocale` | Fallback if translation missing |
| `onError` | `(error) => void` | No | - | Error handler callback |
| `onUpdate` | `() => void` | No | - | Called when translations update |

### Example with All Options

```tsx
<LokaliseProvider
  apiKey="lok_abc123"
  baseUrl="https://translations.myapp.com"
  defaultLocale="en"
  namespaces={["default", "common", "errors"]}
  pollInterval={60000}  // Check every 60 seconds
  fallbackLocale="en"
  onError={(error) => {
    console.error("Translation error:", error);
    Sentry.captureException(error);
  }}
  onUpdate={() => {
    console.log("Translations updated!");
  }}
>
  <App />
</LokaliseProvider>
```

## useTranslation Hook

### Basic Usage

```tsx
const { t, locale, setLocale, isLoading, isReady } = useTranslation("default");
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `t` | `(key: string, params?: object) => string` | Translation function |
| `locale` | `string` | Current locale code |
| `setLocale` | `(locale: string) => void` | Change language |
| `isLoading` | `boolean` | True while fetching translations |
| `isReady` | `boolean` | True when translations loaded |

### Translation Function

```tsx
// Simple translation
t("welcome.message")
// Output: "Welcome to our app"

// With interpolation
t("user.greeting", { name: "Alice" })
// Output: "Hello, Alice!"

// With plurals (if using ICU format)
t("items.count", { count: 5 })
// Output: "You have 5 items"

// Missing key returns key
t("missing.key")
// Output: "missing.key"
```

## Changing Language

```tsx
import { Button } from "react-native";
import { useTranslation } from "@lokalise/sdk-react";

function LanguageSwitcher() {
  const { setLocale } = useTranslation("default");

  return (
    <>
      <Button title="English" onPress={() => setLocale("en")} />
      <Button title="Dansk" onPress={() => setLocale("da")} />
      <Button title="Deutsch" onPress={() => setLocale("de")} />
    </>
  );
}
```

## Loading States

```tsx
function MyScreen() {
  const { t, isLoading, isReady } = useTranslation("default");

  if (!isReady) {
    return <LoadingSpinner />;
  }

  return <Text>{t("welcome.message")}</Text>;
}
```

## Multiple Namespaces

Organize translations into logical groups:

```tsx
// Provider setup
<LokaliseProvider
  namespaces={["default", "errors", "onboarding"]}
  // ... other props
>
  <App />
</LokaliseProvider>

// Using different namespaces
function ErrorMessage() {
  const { t } = useTranslation("errors");
  return <Text>{t("network.timeout")}</Text>;
}

function OnboardingScreen() {
  const { t } = useTranslation("onboarding");
  return <Text>{t("step1.title")}</Text>;
}
```

## Interpolation

Replace variables in translation strings:

```tsx
// Translation: "Hello, {{name}}! You have {{count}} messages."
const { t } = useTranslation("default");

<Text>
  {t("dashboard.greeting", {
    name: user.name,
    count: messages.length
  })}
</Text>
// Output: "Hello, John! You have 3 messages."
```

## How OTA Updates Work

```
1. App starts
   ├─ Load from AsyncStorage (instant render)
   ↓
2. Background polling starts (every 30s)
   ├─ Check manifest for version
   ↓
3. New version detected?
   ├─ No → Continue polling
   ├─ Yes → Fetch new translations
   ↓
4. Translations downloaded
   ├─ Save to AsyncStorage
   ├─ Update React state
   ↓
5. UI automatically re-renders
   ├─ New translations visible
```

**Key Features:**
- Non-blocking - UI stays responsive
- Offline-first - Always uses cache first
- Efficient - Only downloads if changed (ETag)
- Automatic - No manual refresh needed

## Caching Behavior

### AsyncStorage Structure

```javascript
{
  "lokalise:en:default": {
    "version": "v123",
    "timestamp": 1234567890,
    "data": {
      "welcome.message": "Welcome!",
      "user.greeting": "Hello, {{name}}!"
    }
  }
}
```

### Cache Invalidation

Cache is updated when:
- New version detected from server
- User changes locale
- Manual refresh (if implemented)

### Offline Behavior

If network unavailable:
- SDK uses cached translations
- Polling continues (will retry)
- No errors shown to user
- Updates when connection restored

## Error Handling

```tsx
<LokaliseProvider
  // ... other props
  onError={(error) => {
    // Handle translation errors
    if (error.code === "NETWORK_ERROR") {
      // Network issue - SDK will retry
      console.log("Network error, using cached translations");
    } else if (error.code === "INVALID_API_KEY") {
      // Critical error - show alert
      Alert.alert("Configuration Error", "Invalid API key");
    }
  }}
>
  <App />
</LokaliseProvider>
```

## TypeScript

SDK is fully typed:

```typescript
import { useTranslation, TranslationParams } from "@lokalise/sdk-react";

function MyComponent() {
  const { t } = useTranslation("default");

  // TypeScript knows params is optional
  const greeting: string = t("welcome", { name: "Alice" });

  return <Text>{greeting}</Text>;
}
```

## Performance Tips

### 1. Minimize Namespaces

Only load namespaces you need:

```tsx
// Good - only loads what's needed
<LokaliseProvider namespaces={["default"]} />

// Bad - loads unnecessary data
<LokaliseProvider namespaces={["default", "admin", "reports", "etc"]} />
```

### 2. Adjust Poll Interval

Balance freshness vs performance:

```tsx
// Frequent updates (more battery/data usage)
<LokaliseProvider pollInterval={10000} />  // 10 seconds

// Moderate updates (recommended)
<LokaliseProvider pollInterval={30000} />  // 30 seconds

// Infrequent updates (save battery/data)
<LokaliseProvider pollInterval={300000} /> // 5 minutes
```

### 3. Use Namespaces

Group translations logically:

```tsx
// screens/HomeScreen.tsx
const { t } = useTranslation("home");

// screens/SettingsScreen.tsx
const { t } = useTranslation("settings");
```

## Testing

### Mock Translations

```typescript
import { LokaliseProvider } from "@lokalise/sdk-react";
import { render } from "@testing-library/react-native";

// Mock provider for tests
function TestProvider({ children }) {
  return (
    <LokaliseProvider
      apiKey="test"
      baseUrl="http://localhost"
      defaultLocale="en"
      namespaces={["default"]}
      pollInterval={0}  // Disable polling in tests
    >
      {children}
    </LokaliseProvider>
  );
}

it("displays welcome message", () => {
  const { getByText } = render(
    <TestProvider>
      <WelcomeScreen />
    </TestProvider>
  );

  expect(getByText("Welcome!")).toBeTruthy();
});
```

## Troubleshooting

### Translations not updating

1. Check poll interval isn't too long
2. Verify API key is correct
3. Check network connectivity
4. Look for errors in console
5. Verify version changed on server

### Translations showing keys

1. Check namespace is correct
2. Verify key exists on server
3. Check locale is supported
4. Look for API errors

### App slow to start

1. Reduce number of namespaces
2. Check cache is working (AsyncStorage)
3. Verify API is fast (< 100ms)

## Example App

Complete example app available at:
[github.com/allanasp/lokalise/tree/main/examples/react-native](https://github.com/allanasp/lokalise/tree/main/examples/react-native)

## Next Steps

- [Configuration Options](/sdk/configuration)
- [API Reference](/sdk/api-reference)
- [Examples](/sdk/examples)
