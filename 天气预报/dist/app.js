const API_HOST = 'mh5n8mt49p.re.qweatherapi.com';
const API_KEY = 'daab6a1c33d04d8e9ff257d5bbe8eb23'; // 已更新为用户提供的 Key

const elements = {
    location: document.getElementById('location'),
    date: document.getElementById('date'),
    temperature: document.getElementById('temperature'),
    feelsLike: document.getElementById('feels-like'),
    humidity: document.getElementById('humidity'),
    precip: document.getElementById('precip'),
    windSpeed: document.getElementById('wind-speed'),
    weatherIcon: document.getElementById('weather-icon'),
    clothingText: document.getElementById('clothing-text'),
    uvText: document.getElementById('uv-text'),
    reminderText: document.getElementById('reminder-text'),
    citySearch: document.getElementById('city-search'),
    searchBtn: document.getElementById('search-btn'),
    refreshBtn: document.getElementById('refresh-btn'),
    forecastList: document.getElementById('forecast-list')
};

// Default location ID (Shenzhen Bao'an)
const DEFAULT_LOCATION_ID = '101280601';
let currentCityId = DEFAULT_LOCATION_ID;

async function fetchWeatherData(locationId) {
    currentCityId = locationId; // Update current city tracking
    if (!API_KEY) {
        alert('请在 app.js 中配置您的 API_KEY 以获取真实天气数据。');
        return;
    }

    try {
        // 1. Current Weather
        const weatherRes = await fetch(`https://${API_HOST}/v7/weather/now?location=${locationId}&key=${API_KEY}&lang=zh`);
        const weatherData = await weatherRes.json();

        // 2. Indices (Clothing type=3, UV type=5)
        const indicesRes = await fetch(`https://${API_HOST}/v7/indices/1d?location=${locationId}&key=${API_KEY}&type=3,5&lang=zh`);
        const indicesData = await indicesRes.json();

        // 3. 24h Forecast (for Precipitation Probability)
        const hourlyRes = await fetch(`https://${API_HOST}/v7/weather/24h?location=${locationId}&key=${API_KEY}&lang=zh`);
        const hourlyData = await hourlyRes.json();

        // 4. 7-day Forecast
        const forecastRes = await fetch(`https://${API_HOST}/v7/weather/7d?location=${locationId}&key=${API_KEY}&lang=zh`);
        const forecastData = await forecastRes.json();

        if (weatherData.code === '200') {
            updateUI(weatherData.now, indicesData.daily, forecastData.daily, hourlyData.hourly);
        } else {
            handleApiError(weatherData.code);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('无法连接到天气服务，请检查网络或 API 配置。');
    }
}

function updateUI(now, indices, forecast, hourly) {
    // Current Weather
    elements.temperature.textContent = `${now.temp}°`;
    elements.feelsLike.textContent = `体感温度 ${now.feelsLike}°`;
    elements.humidity.textContent = `${now.humidity}%`;

    // Rain Probability (from first hour or forecast)
    if (hourly && hourly.length > 0) {
        elements.precip.textContent = `${hourly[0].pop}%`;
    } else {
        elements.precip.textContent = '0%';
    }

    elements.windSpeed.textContent = `${now.windDir} ${now.windScale}级`;
    elements.weatherIcon.src = getKawaiiIcon(now.icon);

    // Date
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    elements.date.textContent = today.toLocaleDateString('zh-CN', options);

    // Indices
    if (indices) {
        const clothing = indices.find(i => i.type === '3');
        const uv = indices.find(i => i.type === '5');
        if (clothing) elements.clothingText.textContent = clothing.text;
        if (uv) elements.uvText.textContent = `${uv.category}: ${uv.text}`;
    }

    // 7-Day Forecast
    if (forecast) {
        elements.forecastList.innerHTML = '';
        forecast.forEach(day => {
            const date = new Date(day.fxDate);
            const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];

            const item = document.createElement('div');
            item.className = 'forecast-item';
            item.innerHTML = `
                <span>${weekday}</span>
                <img src="${getKawaiiIcon(day.iconDay)}" alt="icon">
                <span>${day.tempMax}°</span>
            `;
            elements.forecastList.appendChild(item);
        });
    }

    // Weather Reminder
    elements.reminderText.textContent = generateReminder(now, forecast, hourly, indices);
}

function generateReminder(now, forecast, hourly, indices) {
    // 1. Temp Drop (Tomorrow vs Today)
    if (forecast && forecast.length >= 2) {
        const todayMax = parseInt(forecast[0].tempMax);
        const tomorrowMax = parseInt(forecast[1].tempMax);
        if (tomorrowMax - todayMax <= -5) {
            return "明天降温明显，记得多加件衣服。";
        }
    }

    // 2. Rain Priority Logic
    // 2.1 Raining Now
    const isRainingNow = now.text.includes('雨');
    if (isRainingNow) {
        return "正在下雨，出门记得带把伞。";
    }

    // 2.2 Rain Soon (Next 5 Hours)
    // Check hourly forecast indices 1 to 5 (approx next 5 hours)
    const rainSoon = hourly ? hourly.find((h, i) => i >= 1 && i <= 5 && parseInt(h.pop) > 50) : null;
    if (rainSoon) {
        return `稍后预计有雨（概率 ${rainSoon.pop}%），出门建议带把伞。`;
    }

    // 2.3 Rain Tomorrow
    // Check forecast[1] (Day 2)
    if (forecast && forecast.length >= 2) {
        const tomorrow = forecast[1];
        if (tomorrow.textDay.includes('雨')) {
            return `明天预计有${tomorrow.textDay}，记得提前准备雨具。`;
        }
    }

    // 3. High Temperature
    if (forecast && forecast.length > 0) {
        const todayMax = parseInt(forecast[0].tempMax);
        if (todayMax > 32) {
            return "气温较高，注意防暑补水。";
        }
    }

    // 4. UV Protection
    if (indices) {
        const uvIndex = indices.find(i => i.type === '5');
        if (uvIndex && parseInt(uvIndex.level) >= 3) {
            return "紫外线较强，出门记得涂防晒。";
        }
    }

    // 5. Humidity (Huanantian)
    if (parseInt(now.humidity) > 85) {
        return "空气潮湿，关好门窗，走路防滑。";
    }

    // 6. Default Greeting
    return "天气不错，祝你有开心的一天。";
}

function getKawaiiIcon(code) {
    // 确保 code 是字符串
    code = String(code);

    // 映射表：优先匹配具体 Code，其次匹配前缀
    // 1xx: 晴/多云
    // 3xx: 雨
    // 4xx: 雪
    // 5xx: 雾/霾

    // Default fallback
    let iconName = 'cloud.png';

    if (code === '100' || code === '150') {
        iconName = 'sun.png';
    } else if (code === '101' || code === '102' || code === '103' || code === '151' || code === '152' || code === '153') {
        iconName = 'cloud.png'; // 多云
    } else if (code === '104' || code === '154') {
        iconName = 'cloud.png'; // 阴 (没有专门的阴天图标，暂时用云)
    } else if (code.startsWith('3')) {
        // 雨
        if (code === '305' || code === '306' || code === '307' || code === '310' || code === '311' || code === '312') {
            iconName = 'rain.png'; // 小雨 中雨 大雨
        } else if (code === '301' || code === '302' || code === '303' || code === '304') {
            iconName = 'thunder.png'; // 雷阵雨
        } else {
            iconName = 'rain.png';
        }
    } else if (code.startsWith('4')) {
        // 雪
        iconName = 'snow.png';
    } else if (code.startsWith('5')) {
        // 雾霾
        iconName = 'cloud.png'; // 暂时用云代替雾
    }

    return `assets/${iconName}`;
}

async function searchCity() {
    const city = elements.citySearch.value.trim();
    if (!city) return;

    // 强制命令：必须输入城市+区名（通常至少3个汉字）
    if (city.length < 3) {
        alert('请按照“城市+区名”的格式输入，例如“北京朝阳”或“深圳南山”。');
        return;
    }

    if (!API_KEY) {
        alert('搜索功能需要 API Key。请在 app.js 中配置。');
        return;
    }

    // Add loading state
    const btn = elements.searchBtn;
    const icon = btn.querySelector('svg') || btn.querySelector('i');
    btn.disabled = true;
    if (icon) icon.classList.add('spinning');

    try {
        const res = await fetch(`https://${API_HOST}/geo/v2/city/lookup?location=${encodeURIComponent(city)}&key=${API_KEY}&lang=zh`);
        const data = await res.json();

        if (data.code === '200' && data.location.length > 0) {
            const loc = data.location[0];

            let cityName = loc.adm2 || '';
            let districtName = loc.name || '';

            // Set display name: prefer "City District", fall back to just name if they are the same
            let displayName = (cityName && cityName !== districtName)
                ? `${cityName} ${districtName}`
                : districtName;

            elements.location.textContent = displayName;
            await fetchWeatherData(loc.id);
            elements.citySearch.value = ''; // Clean search box
        } else {
            alert('未找到该地点，请换个关键词试试（如：武汉洪山）。');
        }
    } catch (err) {
        console.error('Search error:', err);
        alert('搜索出错，请稍后再试。');
    } finally {
        btn.disabled = false;
        if (icon) icon.classList.remove('spinning');
    }
}

function handleApiError(code) {
    const errors = {
        '401': 'API Key 无效或无权访问该接口。',
        '402': 'API 请求次数已达上限。',
        '403': '无权访问该 API。',
        '404': '查询结果为空。'
    };
    alert(`API 错误 (${code}): ${errors[code] || '未知错误'}`);
}

elements.searchBtn.addEventListener('click', searchCity);
elements.citySearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchCity();
});

elements.refreshBtn.addEventListener('click', async () => {
    const icon = elements.refreshBtn.querySelector('svg') || elements.refreshBtn.querySelector('i');
    if (icon) icon.classList.add('spinning');

    try {
        await fetchWeatherData(currentCityId);
        // Wait a tiny bit for the animation to feel satisfying
        await new Promise(resolve => setTimeout(resolve, 800));
    } finally {
        if (icon) icon.classList.remove('spinning');
    }
});

// Initial Load
if (API_KEY) {
    elements.location.textContent = '深圳 宝安'; // Explicitly set default header
    fetchWeatherData(DEFAULT_LOCATION_ID);
} else {
    console.warn('Weather App: Missing API Key. Application is in idle state.');
}
