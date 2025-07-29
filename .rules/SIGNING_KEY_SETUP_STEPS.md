# How to Set Up the Play Store Signing Key for Android Release

This document describes how to use the original Play Store signing key (`signkey.jks`) to sign your Android builds for release and Play Store updates.

---

## 1. Obtain the Keystore Files

- You should have the following file from the original app:
  - `signkey.jks` (Java Keystore)
- (Optional) `private_key.pepk` is for Play App Signing backup/export, not needed for local signing.

---

## 2. Gather Keystore Credentials

You will need:
- **Keystore password**
- **Key alias**
- **Key password**

If you do not know these, ask the previous developer or the person who generated the keystore.

---

## 3. Using EAS Build (Recommended for Expo/React Native)

### a. Upload the Keystore to EAS

Run:
```sh
eas credentials
```
- Select your project.
- Choose **Android**.
- Choose **"Update upload keystore"**.
- Provide the path to `signkey.jks` and enter the passwords/alias when prompted.

### b. Build with EAS

After uploading, build as usual:
```sh
eas build -p android --profile production
```

---

## 4. Using Classic Expo Build (expo build:android)

If you use the classic build system (deprecated):

Run:
```sh
expo build:android -c
```
- When prompted, upload your `signkey.jks` and enter the credentials.

---

## 5. Using Android Studio/Gradle (Bare Workflow)

Add the following to your `android/gradle.properties`:
```
MYAPP_UPLOAD_STORE_FILE=signkey.jks
MYAPP_UPLOAD_KEY_ALIAS=your-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=your-keystore-password
MYAPP_UPLOAD_KEY_PASSWORD=your-key-password
```

In `android/app/build.gradle`, ensure the `signingConfigs` section uses these variables:
```gradle
signingConfigs {
    release {
        if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
            storeFile file(MYAPP_UPLOAD_STORE_FILE)
            storePassword MYAPP_UPLOAD_STORE_PASSWORD
            keyAlias MYAPP_UPLOAD_KEY_ALIAS
            keyPassword MYAPP_UPLOAD_KEY_PASSWORD
        }
    }
}
```

And in the `buildTypes` section:
```gradle
release {
    signingConfig signingConfigs.release
    // ...
}
```

---

## 6. Build and Test

- Build your APK/AAB using your chosen method.
- Test the build on a device.
- The app should now install and update correctly, matching the Play Store signature.

---

## 7. Troubleshooting

- If you get a package conflict or cannot update the app, double-check that you are using the correct keystore and credentials.
- If you have lost the keystore or credentials, you cannot update the app on the Play Store with the same package name.

---

## Example Summary Table

| Step                | Command/Action                                 | Notes                        |
|---------------------|------------------------------------------------|------------------------------|
| Upload keystore     | `eas credentials`                              | Use `signkey.jks`            |
| Build (EAS)         | `eas build -p android`                         | Uses uploaded keystore       |
| Build (Expo classic)| `expo build:android -c`                        | Upload keystore when prompted|
| Build (Gradle)      | Set properties in `gradle.properties`          | Reference in `build.gradle`  |

---

**Keep your keystore and credentials safe! Losing them means you cannot update your app on the Play Store.** 