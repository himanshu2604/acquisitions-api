async function checkApiStatus() {
    const statusBadge = document.getElementById('status-badge');
    const uptimeValue = document.getElementById('uptime-value');
    const latencyValue = document.getElementById('latency-value');
    const logMessage = document.getElementById('log-message');
    const refreshIcon = document.getElementById('refresh-icon');

    // Start loading state
    refreshIcon.classList.add('fa-spin');
    const startTime = performance.now();

    try {
        const response = await fetch('/health');
        const data = await response.json();
        const endTime = performance.now();
        const latency = Math.round(endTime - startTime);

        if (response.ok) {
            statusBadge.innerHTML = `
                <div class="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span class="text-sm font-medium text-emerald-400">Operational</span>
            `;

            // Format uptime
            const uptime = Math.floor(data.uptime);
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = uptime % 60;
            uptimeValue.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            latencyValue.textContent = `${latency} ms`;
            latencyValue.className = latency < 200 ? 'font-mono text-emerald-400' : 'font-mono text-amber-400';

            logMessage.textContent = `[${new Date().toLocaleTimeString()}] Health check passed. System status: ${data.status}`;
        } else {
            throw new Error('API returned non-OK status');
        }
    } catch (error) {
        statusBadge.innerHTML = `
            <div class="w-3 h-3 bg-rose-500 rounded-full"></div>
            <span class="text-sm font-medium text-rose-400">Degraded</span>
        `;
        logMessage.textContent = `Error: ${error.message}`;
        logMessage.classList.add('text-rose-400');
    } finally {
        setTimeout(() => {
            refreshIcon.classList.remove('fa-spin');
        }, 500);
    }
}

// Initial check
document.addEventListener('DOMContentLoaded', () => {
    checkApiStatus();

    // Refresh button
    const refreshBtn = document.getElementById('refresh-status');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', checkApiStatus);
    }

    // Auto-refresh every 30 seconds
    setInterval(checkApiStatus, 30000);
});
