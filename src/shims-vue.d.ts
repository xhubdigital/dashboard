// Mocks all files ending in `.vue` showing them as plain Vue instances
declare module '*.vue' {
  import { ComponentOptions } from 'vue';
  const component: ComponentOptions;
  export default component;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.mp3' {
  const value: string;
  export default value;
}
