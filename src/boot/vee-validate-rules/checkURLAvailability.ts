import { checkRestaurantURL } from '@api/restaurants';
import { i18n } from '@boot/i18n';

let debouncePromise: Promise<string>;
let oldValue: string | null = null;

export function checkURLAvailability(value: string): Promise<string | boolean> {
  if (value === oldValue) {
    return debouncePromise;
  }

  oldValue = value;

  debouncePromise = new Promise((resolve) => {
    void checkRestaurantURL(value).then(({ isAvailable }) => {
      resolve(
        !isAvailable
          ? i18n.global.t('validations.urlAvailability')
          : true as unknown as string,
      );
    });
  });

  return debouncePromise;
}
