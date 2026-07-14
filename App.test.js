const dns = require("dns");

console.log("Default:", dns.getServers());

dns.setServers(["1.1.1.1"]);

console.log("After:", dns.getServers());