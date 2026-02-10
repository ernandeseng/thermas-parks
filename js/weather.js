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

                // Update: Widget is now just a static link, but we can still use the API to maybe show a tooltip or just keep the link static as requested.
                // The user requested: "AO invés do ícone, crie uma frase... e redirecione... para a previsão... no google"

                // We will just change the inner HTML to text. We don't necessarily need the API anymore if it's just a static link text, 
                // BUT it might be nice to keep the temp in the title/tooltip or just remove the API call if truly not needed.
                // However, the prompt implies replacing the icon visualization with the phrase.

                // Let's keep the API fetch to show the temperature in the tooltip (title attribute), but change the display to text.

                weatherWidget.innerHTML = `Veja o clima aqui`;
                weatherWidget.title = `Agora faz ${temp}°C em Olímpia, SP`;
                weatherWidget.style.display = 'flex';
                weatherWidget.href = "https://www.google.com/search?q=previs%C3%A3o+do+tempo+ol%C3%ADmpia+sp";
            })
            .catch(err => {
                console.error('Weather fetch error:', err);
                // Even if fetch fails, show the static link
                weatherWidget.innerHTML = `Veja o clima aqui`;
                weatherWidget.style.display = 'flex';
                weatherWidget.href = "https://www.google.com/search?q=previs%C3%A3o+do+tempo+ol%C3%ADmpia+sp";
            });
    }

    // Initial fetch
    fetchWeather();

    // Auto-update every 30 minutes (1800000 ms)
    setInterval(fetchWeather, 1800000);
});
