# =====================================
# DEFAULT COMMENTS (optional to keep)
# =====================================

# =====================================
# REACT NATIVE (CORE)
# =====================================
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# =====================================
# REACT NATIVE REANIMATED (IMPORTANT)
# =====================================
-keep class com.swmansion.reanimated.** { *; }

# =====================================
# EXPO MODULES
# =====================================
-keep class expo.modules.** { *; }

# =====================================
# ASYNC STORAGE
# =====================================
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# =====================================
# SQLITE (VERY IMPORTANT FOR YOUR APP)
# =====================================
-keep class org.sqlite.** { *; }
-keep class expo.modules.sqlite.** { *; }

# =====================================
# NETWORKING WARNINGS (SAFE TO IGNORE)
# =====================================
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**

# =====================================
# JSON / DATA HANDLING
# =====================================
-keepattributes Signature
-keepattributes *Annotation*

# =====================================
# ENUM SAFETY
# =====================================
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# =====================================
# REFLECTION SAFETY (REACT PROPS)
# =====================================
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}

# =====================================
# REMOVE LOGS IN RELEASE
# =====================================
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}