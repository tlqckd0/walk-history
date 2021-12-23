export function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            const now = new Date();
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        err: 0,
                        time: now.toLocaleTimeString(),
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (err) => {
                    resolve({
                        err: -1,
                        latitude: -1,
                        longitude: -1,
                    });
                },
                { enableHighAccuracy: true, maximumAge: 2000, timeout: 5000 }
            );
        } else {
            reject({ error: -2, latitude: -1, longitude: -1 });
        }
    });
}

export function getDistance({ lat1, lon1, lat2, lon2 }) {
    if (lat1 === lat2 && lon1 === lon2) {
        return 0;
    } else {
        let radlat1 = (Math.PI * lat1) / 180;
        let radlat2 = (Math.PI * lat2) / 180;
        let theta = lon1 - lon2;
        let radtheta = (Math.PI * theta) / 180;
        let dist =
            Math.sin(radlat1) * Math.sin(radlat2) +
            Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = (dist * 180) / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
        //KM로 변환
        return dist;
    }
}
