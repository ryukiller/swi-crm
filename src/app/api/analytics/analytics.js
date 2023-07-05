// // faralli view id 151678718

// import { google } from 'googleapis';
// import { JWT } from 'google-auth-library';

// const privateKeyPem = require('../../../swi-crm-e655c7364833.json');

// export default async function handler(req, res) {
//    const { range } = req.query;
//     console.log(range)
//   // Set up the JWT client
//   const auth = new JWT({
//     email: privateKeyPem.client_email,
//     key: privateKeyPem.private_key,
//     scopes: ['https://www.googleapis.com/auth/analytics.readonly']
//   });

//   // Set up the Google Analytics Reporting API client
//   const analyticsreporting = google.analyticsreporting({ version: 'v4', auth });

//   try {
//     // Query the API

//     if(range == "30gg") {

//     const session1 = await analyticsreporting.reports.batchGet({
//       requestBody: {
//         reportRequests: [
//           {
//             viewId: process.env.GOOGLE_ANALYTICS_VIEW_ID,
//             dateRanges: [
//               {
//                 startDate: '30daysAgo',
//                 endDate: 'yesterday'
//               }
//             ],
//             metrics: [
//               {
//                 expression: 'ga:sessions'
//               }
//             ],
//             dimensions: [
//               {
//                 name: 'ga:date'
//               }
//             ]
//           }
//         ]
//       }
//     });

//     const session2 = await analyticsreporting.reports.batchGet({
//         requestBody: {
//           reportRequests: [
//             {
//               viewId: process.env.GOOGLE_ANALYTICS_VIEW_ID,
//               dateRanges: [
//                 {
//                   startDate: '60daysAgo',
//                   endDate: '30daysAgo'
//                 }
//               ],
//               metrics: [
//                 {
//                   expression: 'ga:sessions'
//                 }
//               ],
//               dimensions: [
//                 {
//                   name: 'ga:date'
//                 }
//               ]
//             }
//           ]
//         }
//       });

//     const rows1 = session1.data.reports[0].data.rows;
//     const dates1 = rows1.map(row => row.dimensions[0]);
//     const sessions1 = rows1.map(row => parseInt(row.metrics[0].values[0]));

//     const rows2 = session2.data.reports[0].data.rows;
//     const dates2 = rows2.map(row => row.dimensions[0]);
//     const sessions2 = rows2.map(row => parseInt(row.metrics[0].values[0]));

//     const data = {
//         rangestart: {
//         dates: dates1,
//         sessions: sessions1
//     },
//     rangeend: {
//         dates: dates2,
//         sessions: sessions2
//     }
//     }

//     // Send the API response back to the client
//     res.status(200).json(data);
// } else if (range == "1anno") {

//     const response = await analyticsreporting.reports.batchGet({
//         requestBody: {
//           reportRequests: [
//             {
//               viewId: process.env.GOOGLE_ANALYTICS_VIEW_ID,
//               dateRanges: [
//                 {
//                   startDate: '30daysAgo',
//                   endDate: 'yesterday'
//                 }
//               ],
//               metrics: [
//                 {
//                   expression: 'ga:sessions'
//                 }
//               ],
//               dimensions: [
//                 {
//                   name: 'ga:date'
//                 }
//               ]
//             }
//           ]
//         }
//       });
//       const rows = response.data.reports[0].data.rows;
//       const dates = rows.map(row => row.dimensions[0]);
//       const sessions = rows.map(row => parseInt(row.metrics[0].values[0]));

//       const data = {
//           dates: dates,
//           sessions: sessions
//       }

//       // Send the API response back to the client
//       res.status(200).json(data);

// } else {
//     const response = await analyticsreporting.reports.batchGet({
//         requestBody: {
//           reportRequests: [
//             {
//               viewId: process.env.GOOGLE_ANALYTICS_VIEW_ID,
//               dateRanges: [
//                 {
//                   startDate: '30daysAgo',
//                   endDate: 'yesterday'
//                 }
//               ],
//               metrics: [
//                 {
//                   expression: 'ga:sessions'
//                 }
//               ],
//               dimensions: [
//                 {
//                   name: 'ga:date'
//                 }
//               ]
//             }
//           ]
//         }
//       });
//       const rows = response.data.reports[0].data.rows;
//       const dates = rows.map(row => row.dimensions[0]);
//       const sessions = rows.map(row => parseInt(row.metrics[0].values[0]));

//       const data = {
//           dates: dates,
//           sessions: sessions
//       }

//       // Send the API response back to the client
//       res.status(200).json(data);
// }


//   } catch (error) {
//     // Handle errors
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// }

import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
const privateKeyPem = require('../../../credenziali/swi-crm-96da882ab1f1.json');

export default async function handler(req, res) {
  // const auth = new google.auth.GoogleAuth({
  //   keyFile: privateKeyPem,
  //   scopes: ['https://www.googleapis.com/auth/analytics.readonly']
  // });

  const { start, end } = req.query

  const Difference_In_Time = new Date(start).getTime() - new Date(end).getTime();
  const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  const comparestart = new Date(start)

  comparestart.setDate(comparestart.getDate() - Math.abs(Difference_In_Days))

  const compare = comparestart.toISOString().split('T')[0]

  const auth = new JWT({
    email: privateKeyPem.client_email,
    key: privateKeyPem.private_key,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly']
  });

  const analyticsData = google.analyticsdata({
    version: 'v1beta',
    auth
  });

  const request = {
    dateRanges: [
      {
        startDate: start,
        endDate: end
      }
    ],
    dimensions: [
      {
        name: 'date'
      }
    ],
    metrics: [
      {
        name: 'screenPageViews'
      }
    ],
    orderBys: [
      {
        dimension: {
          dimensionName: 'date'
        }
      }
    ]

  };

  const request2 = {
    dateRanges: [
      {
        startDate: compare, //start * 2
        endDate: start
      }
    ],
    dimensions: [
      {
        name: 'date'
      }
    ],
    metrics: [
      {
        name: 'screenPageViews'
      }
    ],
    orderBys: [
      {
        dimension: {
          dimensionName: 'date'
        }
      }
    ]

  };

  try {
    const response = await analyticsData.properties.runReport({ property: 'properties/322852986', requestBody: request });
    const rows = response.data.rows;

    const dates1 = rows.map(row => row.dimensionValues[0].value);
    const sessions1 = rows.map(row => row.metricValues[0].value);

    const response2 = await analyticsData.properties.runReport({ property: 'properties/322852986', requestBody: request2 });
    const rows2 = response2.data.rows;

    const dates2 = rows2.map(row => row.dimensionValues[0].value);
    const sessions2 = rows2.map(row => row.metricValues[0].value);

    const data = {
      row1: {
        dates: dates1,
        sessions: sessions1
      },
      row2: {
        dates: dates2,
        sessions: sessions2
      }
    }

    // Send the API response back to the client
    res.status(200).json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while getting the pageviews.' });
  }
}
