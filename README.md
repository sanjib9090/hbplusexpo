:# HB+ Glass : setup and authentication guide

HB+ Glass is an Expo app for Android, iOS and web. It uses Google Sign-In and Supabase Auth, then saves profile details in the Supabase Postgres `public.profiles` table. It is **not** a Supabase Storage bucket implementation.

This guide describes the supplied project. Dashboard and cloud changes must be made by a project administrator; running the app alone does not configure Google or Supabase. Live Google sign-in, database policies and native builds have not been verified as part of this project update.

## 1. Prerequisites

- Node.js 22 or newer and npm (`node --version` and `npm --version`).
- Access to the relevant Google Cloud project and Supabase project.
- For local Android builds: Android Studio, Android SDK, a compatible JDK and a device/emulator with Google Play services.
- For local iOS builds: macOS, Xcode and appropriate Apple signing. The supplied iOS OAuth client ID is blank.
- For EAS cloud builds: an Expo account with access to the linked project.

Unzip the project, open a terminal **in the folder containing `package.json`**, then run:

```sh
npm ci
```

The app uses native Google Sign-In and SecureStore. **Expo Go is not sufficient for native sign-in**; use a development build or a compiled APK/iOS app. Web development does not require a native build.

## 2. Configure environment variables

The ZIP includes `.env` and `.env.example` with the supplied public Google IDs, Supabase project URL and Supabase anon key. If `.env` is missing, create it from the example:

**macOS / Linux / Git Bash**

```sh
cp .env.example .env
```

**Windows PowerShell**

```powershell
Copy-Item .env.example .env
```

Edit `.env` and confirm these values:

```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=<copy-the-public-anon-key-from-.env.example-or-Supabase>
```

Replace placeholders without angle brackets. The complete supplied anon key is already in `.env.example`; use the key belonging to the same Supabase project as the URL. Set an iOS client ID before building iOS. Restart Expo after changing `.env`; rebuild native apps when their native configuration or build-time environment changes.

- `EXPO_PUBLIC_` values are embedded in the app and **are public**, even if EAS displays them as sensitive. The Google IDs and Supabase anon/publishable key are not server secrets.
- **Never** place a Google OAuth client secret, Supabase `service_role`/secret key, keystore or signing password in `.env` exposed to the client, source control or `EXPO_PUBLIC_` variables.
- `.env` is ignored by Git. The Android OAuth ID is stored for reference; this app sends the **web** client ID to Google Sign-In. Android is identified by package name and signing certificate SHA-1.

## 3. Configure Google Cloud

In [Google Cloud Console](https://console.cloud.google.com/), use the Google project containing the web OAuth client:

1. Configure the Google Auth Platform consent screen, app audience and any required test users. Publishing restrictions can prevent users from signing in.
2. For the **Web application OAuth client** matching `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`:
   - Under **Authorized JavaScript origins**, add the exact browser origin used by the app, for example `http://localhost:8081` and the production site's origin. Origins include protocol and port, but not a path.
   - Under **Authorized redirect URIs**, add the exact Supabase callback URL shown in Supabase's Google provider settings. The callback is a redirect URI, not a JavaScript origin. Even though this app uses the Google ID-token callback rather than navigating to a Supabase redirect, configure the provider as Supabase instructs.
3. For **Android**, configure an Android OAuth client with package name `fit.hbplus.glass` and the SHA-1 of the certificate that signs the installed build. Debug, EAS and Play app-signing certificates may be different. Register every certificate used for a build that needs Google sign-in. The Android client ID by itself does not configure the package/SHA-1.
4. For **iOS**, configure an iOS OAuth client with bundle ID `fit.hbplus.glass`. Set its ID in `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` before prebuild and rebuild the iOS app.

To inspect the usual local Android **debug** certificate on macOS/Linux (the standard debug keystore password is `android`):

```sh
keytool -list -v -alias androiddebugkey -keystore "$HOME/.android/debug.keystore" -storepass android -keypass android
```

PowerShell:

```powershell
keytool -list -v -alias androiddebugkey -keystore "$env:USERPROFILE\.android\debug.keystore" -storepass android -keypass android
```

Copy the `SHA1` value. These commands apply only to the standard debug keystore; they do **not** show the EAS or Play signing SHA-1. `keytool` is part of a JDK. For an EAS build, inspect credentials using:

```sh
npx eas-cli credentials -p android
```

Select the relevant build profile and inspect the Android keystore. For Play-distributed builds, check the **app signing** certificate in Play Console. Protect all keystore credentials.

## 4. Configure Supabase

### 4.1 Enable Google

1. Open the Supabase project for the configured URL. In **Authentication → Providers → Google**, enable Google.
2. Enter the Google **web client ID and client secret** in the Supabase dashboard. Keep the secret out of the app. If configuring multiple accepted client IDs, follow the dashboard/Supabase instructions and put the web client ID first.
3. Copy the callback URL shown there into the Google web client's authorized redirect URIs. Set Supabase's site URL and redirect configuration appropriately for your deployed web app.
4. Make sure Supabase Auth and the Data API are available and `public` is an exposed schema.

### 4.2 Create the profile table and policies

Open the Supabase project's **SQL Editor**, open the included `supabase/profiles.sql` file locally, paste its entire contents into the editor and run it. It creates `public.profiles` when absent, adds missing fields to an existing table, enables row-level security (RLS), grants access, installs three named policies and creates an `updated_at` trigger. SQL Editor operations affect the selected live project:verify the project before running them.

**Existing table warning:** `CREATE TABLE IF NOT EXISTS` does not repair an incompatible existing table. Inspect its column types, constraints, grants, triggers and all policies first. This app expects:

| Column | Purpose |
| --- | --- |
| `id` | UUID matching the Supabase Auth user ID; must be unique for the app's upsert. New-table SQL uses a primary key and foreign key to `auth.users`. |
| `email` | Copy of session email, sent on save. Do not use this editable profile copy for authorization. |
| `full_name` | Required in the app; missing/blank names prompt profile completion. |
| `phone` | Optional. |
| `updated_at` | Timestamp; the supplied trigger updates it on changes. |

Additional required columns without defaults, incompatible column types, or different constraints can still prevent saving. The migration replaces policies named `read own profile`, `insert own profile`, and `update own profile` and the named timestamp trigger; inspect them before running it on existing data. Other permissive policies can combine with OR and grant broader access. Review **all** policies and grants, not just these three. The supplied policies protect this table only.

For an existing table that only lacks these app fields, `supabase/add-missing-profile-columns.sql` is a targeted additive migration. It does not configure or repair RLS, existing columns, keys, constraints or other required fields.

## 5. Run and build

Run these commands in the project folder after setup.

**Web development:**

```sh
npm run web
```

Open the URL printed by Expo, and ensure its origin is registered with Google. For a deployable web export:

```sh
npm run build:web
```

The output is in `dist/`. Deploy it to your HTTPS static host and register the deployed origin in Google Cloud. If you change the app code or public environment, rebuild and redeploy the export.

**Local Android development build:**

```sh
npm run android
```

This requires the Android toolchain, a device/emulator and the correct debug signing SHA-1 in Google Cloud. Native configuration changes require rebuilding and reinstalling the app.

**Local iOS development build (macOS only):**

```sh
npm run ios
```

Set the iOS client ID before prebuild/build and use suitable Apple signing.

**Unit tests:**

```sh
npm test
```

These tests cover local logic; they do not prove live Google authentication, Supabase policy isolation or Android/iOS behavior.

## 6. Build an Android APK with EAS

The project is configured for the existing `@sanjib_9090/hbplus-glass` EAS project, project ID `dce7a9df-81f8-4085-ac7f-f494764f3258`. Sign in to an Expo account with access:

```sh
npx eas-cli login
npx eas-cli whoami
```

The included `eas.json` defines `preview` as an internal Android APK build using the `preview` environment. Local `.env` is generally not uploaded, so set the public variables in that EAS environment. Replace each placeholder with the exact value from your local `.env` (do not include `<` or `>`). `env:set` creates or updates each variable:

```sh
npx eas-cli env:set preview --name EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID --value "<WEB_CLIENT_ID>" --visibility plaintext
npx eas-cli env:set preview --name EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID --value "<ANDROID_CLIENT_ID>" --visibility plaintext
npx eas-cli env:set preview --name EXPO_PUBLIC_SUPABASE_URL --value "<SUPABASE_URL>" --visibility plaintext
npx eas-cli env:set preview --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "<SUPABASE_ANON_KEY>" --visibility plaintext
npx eas-cli env:list preview
```

For iOS builds, additionally set:

```sh
npx eas-cli env:set preview --name EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID --value "<IOS_CLIENT_ID>" --visibility plaintext
```

These are public client values. Never substitute the Google client secret or Supabase service-role key. Set the corresponding variables separately in `development` or `production` when using those profiles. Build the preview APK:

```sh
npx eas-cli build --platform android --profile preview
```

Download the APK from the link EAS returns and install it on your device. Keep the **existing signing key** when updating an already installed app; a different key can prevent installation as an update and changes the SHA-1 Google sees. Register the actual signing SHA-1 in Google Cloud. An iOS preview build requires an iOS client ID and Apple signing:

```sh
npx eas-cli build --platform ios --profile preview
```

## 7. Authentication flow

1. The user taps **Continue with Google**. Web uses Google Identity Services; Android/iOS use the native Google Sign-In SDK. Both request a Google ID token for the configured web client ID.
2. The app decodes the token locally and performs early checks for issuer, audience, expiry, verified-email flag and allowed domain. The `hbplus.fit` client check also requires the Google Workspace `hd` claim. These checks are for user experience only: **the app does not verify the Google token signature locally**, and client checks can be bypassed.
3. The app exchanges the Google ID token using Supabase Auth `signInWithIdToken`. Supabase validates the credential and issues the app's session. The current implementation does not pass a nonce; Supabase recommends adding one for extra security where supported.
4. Supabase session restoration is used on subsequent launches. Native sessions are stored in Expo SecureStore; web sessions are in browser localStorage. Use HTTPS and prevent XSS: JavaScript running on the web origin can read localStorage.
5. The app queries `public.profiles` using the signed-in user's ID. A missing profile or blank name leads to **Complete profile**. The user supplies a name and optional phone number; email comes from the signed-in account and is read-only in the form. The app upserts the profile and reloads it. Existing complete profiles lead to the dashboard, where the user can edit the profile.
6. Sign-out clears the Supabase session and attempts to clear the app's Google account selection. A rejected credential clears the app's Google selection so the user can try again; on web Google controls its account chooser.

Supabase Auth stores the authentication account; `profiles` stores user-entered fields and a copy of the account email. That profile email can be changed by a client with access and may be stale until a profile is saved. Do not use it as identity proof; use trusted authentication claims/server-side verification.

## 8. How domain restriction works

### Current allowed domains

- `@hbplus.fit`
- `@outlook.com`

The email must belong to a **Google Account**. An Outlook address needs to be linked to Google; this app does not offer Microsoft sign-in. The domain is matched exactly, case-insensitively; `@example.hbplus.fit` is not the same as `@hbplus.fit`.

There are **two separate checks**:

1. **App check:** `src/auth/policy.cjs` defines `ALLOWED_DOMAINS`. `src/auth/claims.cjs` checks decoded Google claims before the Supabase exchange. This is bypassable and is not an authorization boundary. The special `hbplus.fit` `hd` requirement lives in `claims.cjs` and is also client-side only.
2. **Supabase profile access:** the three RLS policies in `supabase/profiles.sql` check `auth.uid()`, the Supabase JWT Google provider and its email domain for reads, inserts and updates. SQL checks protect **profile rows**, not the entire Supabase Auth signup endpoint or any other tables, APIs or storage. RLS does not enforce the `hd` claim or verify current Workspace membership.

Google's `email_verified` for a third-party Outlook address does not guarantee continuing ownership of that mailbox. If Workspace membership or ongoing ownership is a security requirement, implement and maintain a trusted server-side verification/membership policy appropriate to your organization. Review all Supabase policies: permissive policies combine with OR, so an unrelated broad policy can defeat intended restrictions.

### Add another domain: example `example.com`

Replace `example.com` everywhere below with your actual domain. Do not treat this example as a request to allow it automatically.

1. In `src/auth/policy.cjs`:

```js
const ALLOWED_DOMAINS = ['hbplus.fit', 'outlook.com', 'example.com'];
```

2. Update the visible allowed-domain caption in `src/screens/Login.js`, and update `test/domain.test.cjs` with accepted and deceptive-domain cases. If a domain needs a Workspace membership requirement, do not assume email suffix alone proves membership; the special `hd` handling currently applies only to `hbplus.fit` and only on the client.
3. Edit **all four** regex occurrences in `supabase/profiles.sql` to use the new list. This prevents a future run of that file from reverting the change:

```text
^[^@[:space:]]+@(hbplus[.]fit|outlook[.]com|example[.]com)$
```

Use `[.]` for literal dots. Review escaping for any other allowed domain rather than inserting arbitrary regex metacharacters.
4. Apply matching changes to the **live** Supabase policies. If the three supplied policies exist with these names and you intend to replace their conditions, run the following in the correct project's SQL Editor:

```sql
alter policy "read own profile" on public.profiles
using (
  id = auth.uid()
  and auth.jwt()->'app_metadata'->>'provider' = 'google'
  and coalesce(auth.jwt()->>'email', '') ~*
    '^[^@[:space:]]+@(hbplus[.]fit|outlook[.]com|example[.]com)$'
);

alter policy "insert own profile" on public.profiles
with check (
  id = auth.uid()
  and auth.jwt()->'app_metadata'->>'provider' = 'google'
  and coalesce(auth.jwt()->>'email', '') ~*
    '^[^@[:space:]]+@(hbplus[.]fit|outlook[.]com|example[.]com)$'
);

alter policy "update own profile" on public.profiles
using (
  id = auth.uid()
  and auth.jwt()->'app_metadata'->>'provider' = 'google'
  and coalesce(auth.jwt()->>'email', '') ~*
    '^[^@[:space:]]+@(hbplus[.]fit|outlook[.]com|example[.]com)$'
)
with check (
  id = auth.uid()
  and auth.jwt()->'app_metadata'->>'provider' = 'google'
  and coalesce(auth.jwt()->>'email', '') ~*
    '^[^@[:space:]]+@(hbplus[.]fit|outlook[.]com|example[.]com)$'
);
```

If those policies don't exist or have been customized, inspect the existing schema and policies instead of assuming the example applies. Preserve any extra restrictions you need. Check all other policies too.
5. Run `npm test`, rebuild and redeploy the web app or rebuild/reinstall the native app. Test a user from each allowed domain, a disallowed user, anonymous access, and an allowed user's attempt to access **another user's** profile. Confirm that only the owner has access. Consider sign-out/sign-in to obtain refreshed claims after account changes.

Changing JavaScript alone will not update Supabase's existing RLS policies, so a newly allowed domain can still fail to read/save its profile. Removing the SQL domain check while relying only on JavaScript means an authenticated client can bypass the app's domain filter and call the Data API directly. Owner-only RLS should remain in either design.

## 9. Troubleshooting

| Symptom | What to check |
| --- | --- |
| Sign-in canceled/closed | Retry and select the intended Google account. Cancellation alone does not prove a configuration problem. If it repeatedly closes unexpectedly, check the package, the **actual installed build's** SHA-1, web client ID, consent/test users and Play services. |
| `DEVELOPER_ERROR` or Android code `10` | Verify `fit.hbplus.glass`, the correct signing SHA-1, OAuth project and web client ID. Run `npx @react-native-google-signin/config-doctor` for additional diagnostics. |
| Wrong Google account keeps appearing | Choose another account in Google's chooser. On web, add the allowed account to Google or try a separate browser profile/private window. Native clears the app's cached Google selection before retrying. |
| Allowed account says not allowed | Verify the exact address and current allowed-domain code. `@hbplus.fit` also requires the Google Workspace `hd` claim in the client check. Ensure the deployed build includes your latest policy changes. |
| `profiles.full_name` missing | Check the selected Supabase project and run the targeted `supabase/add-missing-profile-columns.sql` after reviewing the table. |
| `profiles.email` not-null violation | Use the updated app version that sends the session email. Check for any other required existing columns; do not remove constraints without understanding the schema. |
| Profile access denied / save fails | Check RLS, grants, profile ID, domain policies and Supabase logs. An RLS-filtered row may appear missing; the app's UI message is intentionally concise. |
| App still shows old UI | Restart the dev server with `npx expo start --clear`; for web rebuild/redeploy and refresh. For Android rebuild/reinstall the APK, preserving the signing key. |
| Small-screen scrolling | Overscroll bounce is disabled and scrolling is disabled when content fits. It remains available for the keyboard, errors, long content and large accessibility text. |

## Reference links

- [Supabase: Sign in with Google](https://supabase.com/docs/guides/auth/social-sign-in/auth-google)
- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Expo: EAS CLI reference](https://docs.expo.dev/eas/cli/)
- [Expo: Environment variables in EAS](https://docs.expo.dev/eas/using-environment-variables/)
