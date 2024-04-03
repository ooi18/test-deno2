import { Application, route, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
// import { IP2Location, IPTools } from "https://deno.land/x/ip2location@8.2.0/mod.ts";
import { IP2Location, IPTools } from "./mod.ts";
// import { IP2Location, IPTools } from "npm:ip2location-nodejs@9.6.1";
import { readSync, openSync, closeSync, existsSync } from "node:fs";
import { Buffer } from 'node:buffer';

const app = new Application();
const router = new Router();
// const ip2location = new IP2Location();
// const iptools = new IPTools();

// ip2location.open("./IP2LOCATION-LITE-DB3.BIN");

function readRow(fd, readBytes, position) {
  let buffer = new Buffer.alloc(readBytes);
  let totalRead = readSync(fd, buffer, 0, readBytes, position - 1);
  return buffer;
}

function read32Row(position, buffer) {
	return buffer.readUInt32LE(position);
}

router.get('/', ctx => {
	
	

    const ip = ctx.request.ip;
    // const ip = '60.50.38.241';
    // const geo = ip2location.getAll(ip);
    const mesg = 'Calling from local ipl deno';
	
	let fd = openSync("./IP2LOCATION-LITE-DB3.BIN", "r");
	let len = 64; // 64-byte header
	let row = readRow(fd, len, 1);
	let indexBaseAddress = read32Row(21, row);
	// len = 65536;
	// len *= 8; // 4 bytes for both From/To
	row = readRow(fd, 524288, indexBaseAddress);
	console.log(read32Row(524284, row));

    ctx.response.body = {
        ip: ip,
        mesg: mesg
        // database_version: ip2location.getDatabaseVersion(),
        // package_version: ip2location.getPackageVersion(),
        // api_version: ip2location.getAPIVersion(),
        // is_ipv4: iptools.isIPV4(ip),
        // results: geo,
        // country: geo.country_long,
        // city: geo.city,
        // region: geo.region
    };
})

app.use(oakCors());
app.use(router.routes());

app.listen({ port: 8000 });