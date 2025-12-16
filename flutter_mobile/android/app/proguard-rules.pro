# Flutter-specific ProGuard rules.
-dontwarn io.flutter.embedding.**

# Standard rules for Flutter.
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.**  { *; }
-keep class io.flutter.util.**  { *; }
-keep class io.flutter.view.**  { *; }
-keep class io.flutter.**  { *; }
-keep class io.flutter.plugins.**  { *; }

# Previous rules that should have worked but did not.
-keep public class * extends io.flutter.embedding.android.FlutterActivity { public <init>(); }
-keep public class * extends io.flutter.embedding.android.FlutterFragmentActivity { public <init>(); }
-keep public class * extends io.flutter.plugin.common.PluginRegistry { public <init>(); }

# New, highly specific rule to force ProGuard to keep the MainActivity.
# This explicitly references the exact class name from the crash log.
-keep class vn.mchisxyz.flutter_mobile.MainActivity { *; }
