function WeatherIcon({ icon, size = 64 }) {
    if (!icon) return null;
    const iconUrl = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/1st%20Set%20-%20Color/${icon}.png`;
    return (
        <img
            src={iconUrl}
            alt={icon}
            width={size}
            height={size}
            onError={(e) => {
                // Optional fallback if image fails to load
                e.currentTarget.style.display = 'none';
            }}
        />
    );
}
export default WeatherIcon;