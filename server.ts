import { Application, route, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
// import { IP2Location, IPTools } from "https://deno.land/x/ip2location@8.2.0/mod.ts";
import { IP2Location, IPTools } from "./mod.ts";
// import { IP2Location, IPTools } from "npm:ip2location-nodejs@9.6.1";

const app = new Application();
const router = new Router();
const ip2location = new IP2Location();
const iptools = new IPTools();

ip2location.open("./IP2LOCATION-LITE-DB3.BIN");

router.get('/', ctx => {

    const ip = ctx.request.ip;
    // const ip = '60.50.38.241';
    const geo = ip2location.getAll(ip);
    const mesg = 'Calling from local ipl deno';

    ctx.response.body = {
        ip: ip,
        mesg: mesg,
        database_version: ip2location.getDatabaseVersion(),
        package_version: ip2location.getPackageVersion(),
        api_version: ip2location.getAPIVersion(),
        is_ipv4: iptools.isIPV4(ip),
        results: geo,
        country: geo.country_long,
        city: geo.city,
        region: geo.region
    };
})

app.use(oakCors());
app.use(router.routes());

app.listen({ port: 8000 });