mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/dark-v11', // style URL
center:campground.geometry.coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});

const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h6>${campground.title}</h6> <p>${campground.location}</p>`
    );

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(popup)
    .addTo(map)
