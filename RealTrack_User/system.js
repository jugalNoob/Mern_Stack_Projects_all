✅ How it works:

Each client sends location on connect and updates every 5 seconds.

Server keeps map of userId → {lat, lng} and broadcasts updates.

React + Leaflet displays each user as a marker on the map in real-time.

You can see users moving if they change location (simulate on multiple devices).