// Initialize the fruit distribution map
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map
    const map = L.map('fruit-map').setView([20, 0], 2);

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Sample fruit data (in a real app, this would come from an API)
    const fruitData = [
        {
            name: "Mango",
            type: "tropical",
            origin: [23, 80], // India
            countries: ["India", "China", "Thailand", "Mexico", "Brazil"]
        },
        {
            name: "Dragon Fruit",
            type: "tropical",
            origin: [13, -85], // Central America
            countries: ["Vietnam", "Thailand", "Philippines", "Israel", "USA"]
        },
        {
            name: "Blueberry",
            type: "berries",
            origin: [45, -90], // North America
            countries: ["USA", "Canada", "Chile", "Peru", "Mexico"]
        },
        {
            name: "Orange",
            type: "citrus",
            origin: [27, 78], // Northern India
            countries: ["Brazil", "USA", "China", "India", "Mexico"]
        },
        {
            name: "Apple",
            type: "temperate",
            origin: [43, 79], // Kazakhstan
            countries: ["China", "USA", "Turkey", "Poland", "India"]
        },
        {
            name: "Banana",
            type: "tropical",
            origin: [5, -75], // Southeast Asia
            countries: ["India", "China", "Philippines", "Ecuador", "Brazil"]
        },
        {
            name: "Grapes",
            type: "temperate",
            origin: [41, 12], // Mediterranean
            countries: ["China", "Italy", "USA", "Spain", "France"]
        }
    ];

    // Create markers for each fruit
    const markers = [];
    fruitData.forEach(fruit => {
        const marker = L.circleMarker(fruit.origin, {
            radius: 8,
            fillColor: getColorForFruitType(fruit.type),
            color: "#fff",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
        
        marker.bindPopup(`
            <h3>${fruit.name}</h3>
            <p><strong>Type:</strong> ${fruit.type}</p>
            <p><strong>Native to:</strong> ${fruit.countries[0]}</p>
            <p><strong>Main producers:</strong> ${fruit.countries.slice(0, 3).join(", ")}</p>
        `);
        
        markers.push({
            marker: marker,
            type: fruit.type
        });
    });

    // Filter markers by fruit type
    const typeSelect = document.getElementById('map-fruit-type');
    typeSelect.addEventListener('change', function() {
        const selectedType = this.value;
        
        markers.forEach(item => {
            if (selectedType === 'all' || item.type === selectedType) {
                item.marker.addTo(map);
            } else {
                map.removeLayer(item.marker);
            }
        });
    });

    // Helper function to get color based on fruit type
    function getColorForFruitType(type) {
        const colors = {
            tropical: '#FF7D33',
            citrus: '#FFC107',
            berries: '#9C27B0',
            stone: '#E91E63',
            melons: '#4CAF50',
            exotic: '#3F51B5',
            temperate: '#2196F3'
        };
        return colors[type] || '#607D8B';
    }
});