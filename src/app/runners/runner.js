// Save a time and location object in the Capacitor KV store
addEventListener('checkIn', async (resolve, reject, args) => {
    try {
        console.log('checkIn event fired');
        const { value } = CapacitorKV.get('CHECKINS'); // Gather some data
        const time = new Date().getTime();
        const location = await CapacitorGeolocation.getCurrentPosition(); // Create an array of checkins
        let checkinArr = [{ location, time }]; // Try to append our data to the existing array
        try {
            const parsedArr = JSON.parse(value);
            checkinArr = [...parsedArr, { location, time }];
        } catch (e) {
            console.log('no checkins');
        }

        console.log(checkinArr); // Save the array
        CapacitorKV.set('CHECKINS', JSON.stringify(checkinArr));
        console.log('checkin saved'); // Resolve the event call
        resolve();
    } catch (err) {
        console.error(err);
        reject(err);
    }
});

// Get all checkins from the Capacitor KV store
addEventListener('loadCheckins', (resolve, reject, args) => {
    try {
        const { value } = CapacitorKV.get('CHECKINS');
        try {
            const arr = JSON.parse(value);
            resolve(arr);
        } catch (e) {
            resolve([]);
        }
    } catch (err) {
        console.error(err);
        reject([]);
    }
});