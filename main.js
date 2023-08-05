document.addEventListener("DOMContentLoaded", function () {
    fetch("datas.json")
        .then(response => response.json())
        .then(data => processData(data))
        .catch(error => console.error('Error fetching JSON: ', error));
});


function processData(data,) {
    var outputDiv = document.getElementById("output");
    LatLongData = data.map((data, index) => { return data.address.geo });


    // Haversine formula to calculate the distance between two points on Earth
    function haversine(lat1, lng1, lat2, lng2) {
        const toRadians = (degrees) => (degrees * Math.PI) / 180;
        const R = 6371; // Earth's radius in kilometers

        const dLat = toRadians(lat2 - lat1);
        const dLng = toRadians(lng2 - lng1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // Depth-First Search Algorithm to group locations
    function dfsGroup(LatLongData, startIdx, group, visited, maxDistance) {
        const currentLocation = LatLongData[startIdx];
        visited[startIdx] = true;
        group.push(currentLocation);

        for (let i = 0; i < LatLongData.length; i++) {
            if (!visited[i]) {
                const nextLocation = LatLongData[i];
                const distance = haversine(
                    currentLocation.latitude,
                    currentLocation.longitude,
                    nextLocation.latitude,
                    nextLocation.longitude
                );

                if (distance <= maxDistance) {
                    dfsGroup(LatLongData, i, group, visited, maxDistance);
                }
            }
        }
    }

    // Function to group locations using DFS and Haversine formula
    function groupLocationsByDistance(LatLongData, maxDistance) {
        const groups = [];
        const visited = new Array(LatLongData.length).fill(false);

        for (let i = 0; i < LatLongData.length; i++) {
            if (!visited[i]) {
                const group = [];
                dfsGroup(LatLongData, i, group, visited, maxDistance);
                if (group.length > 1) {
                    groups.push(group);
                }

            }
        }

        return groups;
    }


    const maxDistance = 1000; // Maximum distance in kilometers

    const groups = groupLocationsByDistance(LatLongData, maxDistance);

    let totalGroups = 0;
    let maxGroupIndex = -1;
    let maxGroupSize = 0;
    let minGroupIndex = -1;
    let minGroupSize = Number.MAX_SAFE_INTEGER;

    // Print the results in the console
    groups.forEach((group, index) => {
        if (group.length > 1) {
            console.log('');
            console.log(`Group ${index + 1}:`);
            group.forEach((location) => {
                LatCheckData = data.map((data, index) => { return data.address.geo.latitude });
                LongCheckData = data.map((data, index) => { return data.address.geo.longitude });
                NameCheckData = data.map((data, index) => { return data.fullName });
                //console.log(`- latitude: ${location.latitude}, longitude: ${location.longitude}`);
                for (k = 0; k < data.length; k++) {
                    if (location.latitude == LatCheckData[k] && location.longitude == LongCheckData[k]) {
                        console.log(NameCheckData[k])
                    }
                }
            });
            const groupSize = group.length;
            console.log(`- No.of members in group${index+1} = ${group.length}`);
            totalGroups++;

            if (groupSize > maxGroupSize) {
                maxGroupSize = groupSize;
                maxGroupIndex = index;
              }
          
              if (groupSize < minGroupSize) {
                minGroupSize = groupSize;
                minGroupIndex = index;
              }

        }

    });
    console.log('');
    console.log(`Total number of groups: ${totalGroups}`);
    console.log('');
    console.log(`Group ${maxGroupIndex + 1} has the highest number of elements.`);
    console.log(`Group ${minGroupIndex + 1} has the lowest number of elements.`);

}

