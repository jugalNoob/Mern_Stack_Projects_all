import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  cloud: {
    projectID: 3712096,
    name: 'HomeRouteTest'
  }
};

export default function () {
  const res = http.get("http://localhost:9000/home");

  // Optional: log if status is not 200
  if (res.status !== 200) {
    console.error(`❌ Failed with status ${res.status}`);
  }

  sleep(1);
}


// import http from 'k6/http';
// import { sleep } from 'k6';

// export const options = {
//   vus: 10,
//   duration: '30s',
//   cloud: {
//     // Project: SocketLive
//     projectID: 3765902,
//     // Test runs with the same name groups test runs together.
//     name: 'Test (06/05/2025-03:16:25)'
//   }
// };

// export default function() {
//   http.get('https://quickpizza.grafana.com');
//   sleep(1);
// }

// /https://gapifix705.grafana.net/a/k6-app/projects/3765902/tests/new -->app website 

// -->> k6 cloud login --token da97b13d6d2ff189743771351b6d3e685795970326b04187018d9f381a99ef5c




///  gapifix705@idoidraw.com 

// /jugal78564123

// __tests__/home.test.js
// const request = require('supertest');
// const app = require('../server'); // Export your Express app instance

// test('GET /home should return data', async () => {
//   const response = await request(app).get('/home');
//   expect(response.statusCode).toBe(200);
//   expect(Array.isArray(response.body)).toBe(true);
// });
