import { createProxyChannel } from "../proxyChannel";

// 替换为你挂载的API，比如您的所有API挂载到 window.apis，就替换为 window.apis
const proxy = createProxyChannel(window);
proxy.example.testCall("test", 123);
