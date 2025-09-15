const os = require('os');

// Convert seconds to hh:mm:ss
function formatUptime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs}h ${mins}m ${secs}s`;
}

function getBootTime() {
    const bootTimestamp = Date.now() - (os.uptime() * 1000); // in ms
    return new Date(bootTimestamp).toLocaleString(); // readable boot time
}

function monitorUptime() {
    const uptimeSeconds = os.uptime();
    const formattedUptime = formatUptime(uptimeSeconds);
    const bootTime = getBootTime();

    console.log("🟢 System Uptime:", formattedUptime);
    console.log("🕒 Boot Time     :", bootTime);
}

monitorUptime();