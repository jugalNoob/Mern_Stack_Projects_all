// const os = require('os');

// function getNetworkBytes() {
//     const interfaces = os.networkInterfaces();

//     // console.log(interfaces)
//     const stats = {};

//     for (const [name, infos] of Object.entries(interfaces)) {
//         for (const info of infos) {
//             if (info.family === 'IPv4' && !info.internal) {
//                 // On most systems, bytes received/sent are not provided by os,
//                 // so we can only track IP/interface availability here unless we use a system command.
//                 stats[name] = {
//                     address: info.address,
//                     mac: info.mac,
//                     netmask: info.netmask,
//                 };
//             }
//         }
//     }

//     return stats;
// }


// console.log(getNetworkBytes());




// network/net.js
const os = require('os');

function getNetworkInfo() {
  const interfaces = os.networkInterfaces();
  const stats = {};

  for (const [name, infos] of Object.entries(interfaces)) {
    for (const info of infos) {
      if (info.family === 'IPv4' && !info.internal) {
        stats[name] = {
          address: info.address,
          mac: info.mac,
          netmask: info.netmask,
        };
      }
    }
  }

  return {
    hostname: os.hostname(),
    platform: os.platform(),
    uptime: os.uptime(),
    cpus: os.cpus().length,
    memory: {
      total: os.totalmem(),
      free: os.freemem()
    },
    networkInterfaces: stats
  };
}

module.exports = { getNetworkInfo };
