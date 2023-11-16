import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'it.bionicco.refezione',
  appName: 'Refezione Scolastica',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "notification",
      iconColor: "#0fa3b1",
      sound: "bubble.wav",
    },
    SplashScreen: {
      "launchShowDuration": 1000,
      "launchAutoHide": true,
      "androidScaleType": "CENTER_CROP",
      "splashImmersive": true,
      "backgroundColor": "#eae0d5"
    }
  },
  bundledWebRuntime: false
};

export default config;
