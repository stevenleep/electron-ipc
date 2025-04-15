import { createProxyChannel } from "../proxyChannel";

const proxy = createProxyChannel({});
proxy.example.testCall("test", 123);
