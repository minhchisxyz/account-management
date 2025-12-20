# Account Management App

A modern, full-featured personal finance and transaction management application built with Flutter. This app allows users to track their spending and earnings across multiple currencies, specifically focusing on EUR and VND conversions.

## 🚀 Key Features

*   **Intelligent Transaction Management**: 
    *   Create, view, update, and delete transactions.
    *   Automatic categorization into Spending or Earning.
*   **AI-Powered Conversion**: 
    *   Convert natural language prompts into structured transaction data using integrated AI.
*   **Voice-to-Text Integration**: 
    *   Record transaction descriptions using voice input with multi-language support (Default: Vietnamese).
*   **Visual Data Analytics**:
    *   Dynamic line charts for daily, monthly, and yearly summaries using `fl_chart`.
    *   Real-time balance tracking in both EUR and VND.
*   **Currency Exchange Rates**:
    *   Live historical rate charts.
    *   Quick conversion tool for instant EUR to VND calculations.
*   **Dynamic Theme Support**:
    *   Fully integrated Light and Dark modes.
*   **Seamless Navigation**:
    *   Drill-down navigation from yearly summaries to monthly details.
    *   Global state management for consistent data across pages.

## 🛠 Tech Stack

*   **Framework**: [Flutter](https://flutter.dev/)
*   **Charts**: [fl_chart](https://pub.dev/packages/fl_chart)
*   **Voice Recognition**: [speech_to_text](https://pub.dev/packages/speech_to_text)
*   **Networking**: [http](https://pub.dev/packages/http)
*   **Localization**: [intl](https://pub.dev/packages/intl)

## 🚦 Getting Started

### Prerequisites
*   Flutter SDK (v3.10.3 or higher)
*   A deployed instance of the `next-backend` server.

### Configuration
1.  Navigate to the `lib/env/` folder.
2.  Create a new file named `env.dart`.
3.  Copy the following template and replace the placeholders with your actual server details (use the URL where your `next-backend` is deployed):

```dart
class Env {
  static const String baseUrl = 'YOUR_DEPLOYED_BACKEND_URL'; // e.g., https://your-account-backend.com
  static const String username = 'YOUR_API_USERNAME';
  static const String password = 'YOUR_API_PASSWORD';
}
```

*Note: The `env/` folder is ignored by Git for security. Ensure you do not commit your real credentials.*

### Installation
1.  Install dependencies:
    ```bash
    flutter pub get
    ```
2.  Run the application:
    ```bash
    flutter run
    ```

## 📱 Platform Specifics (Android)
*   Requires `compileSdkVersion 33` or higher.
*   Requires Microphone and Bluetooth permissions for voice features.
*   Main Activity extends `FlutterFragmentActivity` for robust permission handling.
