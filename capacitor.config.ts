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
      // smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      // sound: "beep.wav",
    },
  },
  bundledWebRuntime: false,
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 1000,
      "launchAutoHide": true,
      "androidScaleType": "CENTER_CROP",
      "splashImmersive": true,
      "backgroundColor": "#003345"
    }
  },
};

export default config;
