import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'BarberShopMobile',
  webDir: 'www',
  server: {
    url: 'http://192.168.0.29:8100',
    cleartext: true
  }
};

export default config;
