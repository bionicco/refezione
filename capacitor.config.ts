import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'it.bionicco.refezione',
  appName: 'Refezione Scolastica',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    BackgroundRunner: {
      label: 'it.bionicco.refezione.check',
      src: 'runners/runner.js',
      event: 'checkIn',
      repeat: true,
      interval: 30,
      autoStart: true,
    },
  },
};

export default config;
