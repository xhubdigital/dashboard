import { precacheAndRoute } from 'workbox-precaching';

interface ThisType {
  __WB_MANIFEST: string[];
  registration: {
    showNotification: (label: string, options: unknown) => unknown;
  }
}

precacheAndRoute((self as unknown as ThisType).__WB_MANIFEST);
