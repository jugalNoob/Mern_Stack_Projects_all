
const os = require("node:os");

function calculateCPU(oldCPU, newCPU) {
    const oldTotal = Object.values(oldCPU.times).reduce((a, b) => a + b);
    const newTotal = Object.values(newCPU.times).reduce((a, b) => a + b);

    const idle = newCPU.times.idle - oldCPU.times.idle;
    const total = newTotal - oldTotal;
    const used = total - idle;

    return ((100 * used) / total).toFixed(1);
}

async function getCPUUsage() {
    const oldCpus = os.cpus();

    return new Promise((resolve) => {
        setTimeout(() => {
            const newCpus = os.cpus();
            const usage = newCpus.map((cpu, i) => ({
                core: i,
                usage: calculateCPU(oldCpus[i], newCpus[i]) + "%",
            }));
            resolve(usage);
        }, 2000);
    });
}

module.exports = { getCPUUsage };