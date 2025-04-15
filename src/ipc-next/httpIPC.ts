import Koa from "koa";
import Router from "@koa/router";

const app = new Koa();
const router = new Router();

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);

export function createHttpCallListener(
  context: any,
  routeName: string,
  handler: Function,
  config = {}
) {
  router.post(routeName, function () {
    console.log("-------------");
  });
}
