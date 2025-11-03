/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // {} 대신 object, any 대신 unknown 사용
  const component: DefineComponent<object, object, unknown>
  export default component
}
