# How to Change the Android Package Name in This Project

This document describes the step-by-step process used to change the Android package name for this Expo/React Native project.

---

## 1. Update Expo Config (`app.json`)

**Before:**
```json
"android": {
  "package": "com.nisarg39.vicharGroup"
}
```

**After:**
```json
"android": {
  "package": "com.vichareducation.jee_neet"
}
```

---

## 2. Update Native Android Build Config (`android/app/build.gradle`)

**Before:**
```gradle
namespace 'com.vichargroup'
applicationId 'com.vichargroup'
```

**After:**
```gradle
namespace 'com.vichareducation.jee_neet'
applicationId "com.vichareducation.jee_neet"
```

---

## 3. Move Java/Kotlin Source Files to New Package Directory

- Moved files from:
  - `android/app/src/main/java/com/vichargroup/`
- To:
  - `android/app/src/main/java/com/vichareducation/jee_neet/`

---

## 4. Update Package Statements in Kotlin Files

**In both `MainActivity.kt` and `MainApplication.kt`:**

**Before:**
```kotlin
package com.vichargroup
```

**After:**
```kotlin
package com.vichareducation.jee_neet
```

---

## 5. Update BuildConfig Import in Kotlin Files

**Before:**
```kotlin
import BuildConfig
```

**After:**
```kotlin
import com.vichareducation.jee_neet.BuildConfig
```

---

## 6. Remove Old Package Directory

- Deleted the now-empty directory:
  - `android/app/src/main/java/com/vichargroup/`

---

## 7. Clean the Android Build

From the project root, run:
```sh
cd android
./gradlew clean
cd ..
```

---

## 8. Check and Update All References

- Searched the project for any remaining references to `com.vichargroup` and updated them to `com.vichareducation.jee_neet`.
- Example: In `build.gradle`, updated the `namespace` and `applicationId`.

---

## 9. (Optional) Update AndroidManifest.xml

- If you reference activities or application classes by package, update them to the new package name.
- Example:
  - `android:name=".MainApplication"` is valid if the class is in the root of the package.

---

## 10. Rebuild and Test

- Build the app using your preferred method (EAS Build, Gradle, etc.).
- Test on a device to ensure the package name is correct and the app installs without conflict.

---

## Example Summary Table

| File/Config                | Old Value                        | New Value                          |
|---------------------------|----------------------------------|------------------------------------|
| app.json                  | com.nisarg39.vicharGroup         | com.vichareducation.jee_neet       |
| build.gradle (namespace)  | com.vichargroup                  | com.vichareducation.jee_neet       |
| build.gradle (appId)      | com.vichargroup                  | com.vichareducation.jee_neet       |
| Kotlin package statement  | com.vichargroup                  | com.vichareducation.jee_neet       |
| BuildConfig import        | BuildConfig                      | com.vichareducation.jee_neet.BuildConfig |

---

**Note:**
- If you are updating an app already on the Play Store, you must use the same signing key as the original app.
- If you need to update the signing key, see the Play Store documentation or use EAS credentials manager. 