const http = require("http");

function fetchStream(stream) {
    const options = {
        hostname: 'localhost',
        port: 4000,
        path: `/stream/${stream}`,
        method: 'GET'
    };

    return new Promise((resolve, reject) => {
        let data = '';
        const req = http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)))
        });

        req.on('error', e => reject(e));
        req.end();
    });
}

function registeredPlayersProjection(events) {
    return events.reduce((acc, {type, payload}) => {
        switch (type) {
            case 'PlayerHasRegistered': {
                acc[payload.player_id] = {first_name: payload.first_name, last_name: payload.last_name}
                return acc;
            }
            default: return acc
        }
    }, {});
}

fetchStream(0)
    .then(events => console.log(registeredPlayersProjection(events)))
    .catch(error => console.log(error));
