document.addEventListener('DOMContentLoaded', () => {
    const weatherWidget = document.getElementById('nav-weather');
    if (!weatherWidget) return;

    function fetchWeather() {
        console.log('Updating weather...');
        fetch('https://api.open-meteo.com/v1/forecast?latitude=-20.7383&longitude=-48.9147&current_weather=true&timezone=America%2FSao_Paulo')
            .then(response => response.json())
            .then(data => {
                const temp = Math.round(data.current_weather.temperature);
                const code = data.current_weather.weathercode;
                let iconClass = 'fa-sun';

                // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
                if (code === 0) iconClass = 'fa-sun';
                else if ([1, 2, 3].includes(code)) iconClass = 'fa-cloud-sun';
                else if ([45, 48].includes(code)) iconClass = 'fa-smog';
                else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) iconClass = 'fa-cloud-rain';
                else if ([71, 73, 75, 77, 85, 86].includes(code)) iconClass = 'fa-snowflake';
                else if ([95, 96, 99].includes(code)) iconClass = 'fa-bolt';

                weatherWidget.innerHTML = `<i class="fas ${iconClass}"></i> ${temp}°C`;
                weatherWidget.style.display = 'flex';
                weatherWidget.title = "Clima atual em Olímpia, SP";
            })
            .catch(err => {
                console.error('Weather fetch error:', err);
                // Hide only if we never got data, otherwise keep old data
                if (weatherWidget.innerHTML === '<i class="fas fa-spinner fa-spin"></i>') {
                    weatherWidget.style.display = 'none';
                }
            });
    }

    // Initial fetch
    fetchWeather();

    // Auto-update every 30 minutes (1800000 ms)
    setInterval(fetchWeather, 1800000);
});
