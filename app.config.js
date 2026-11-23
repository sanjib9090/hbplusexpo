const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const iosUrlScheme = iosClientId && iosClientId.endsWith('.apps.googleusercontent.com')
  ? `com.googleusercontent.apps.${iosClientId.slice(0, -'.apps.googleusercontent.com'.length)}` : undefined;
export default {
  expo: {
    name: 'HB+ Glass', slug: 'hbplus-glass', owner: 'sanjib_9090', scheme: 'hbplus-glass', version: '1.0.0',
    orientation: 'portrait', userInterfaceStyle: 'dark', icon: './assets/icon.png',
    ios: { bundleIdentifier: 'fit.hbplus.glass' },
    android: { package: 'fit.hbplus.glass', softwareKeyboardLayoutMode: 'resize', adaptiveIcon: { foregroundImage: './assets/adaptive-foreground.png', backgroundColor: '#0a2929' } },
    web: { bundler: 'metro' },
    extra: { eas: { projectId: 'dce7a9df-81f8-4085-ac7f-f494764f3258' } },
    plugins: [
      'expo-secure-store',
      ['expo-splash-screen', { image: './assets/splash-logo.png', imageWidth: 200, resizeMode: 'contain', backgroundColor: '#0a2929' }],
      ...(iosUrlScheme ? [['@react-native-google-signin/google-signin', { iosUrlScheme }]] : [])
    ]
  }
};
