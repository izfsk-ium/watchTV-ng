import "normalize.css"
import App from './App.svelte'

document.title = "加载中...";

const app = new App({
  target: document.getElementById('app') as any,
})

export default app;
