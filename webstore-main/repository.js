const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
//const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
//const TOKEN_PATH = path.join(process.cwd(), 'token.json');
//const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}
 */
/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}
*/
/**
 * Load or request or authorization to call APIs.
 *

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}
*/

const oAuth2Client = new google.auth.OAuth2(
  "888127429616-jn3s3iqi5t9lnnmqhbvlan6kek3nj18a.apps.googleusercontent.com",
  "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",
  "http://localhost:3000/oauth2callback"
);
oAuth2Client.setCredentials({
  type: 
  "authorized_user",
  client_id: 
  "888127429616-jn3s3iqi5t9lnnmqhbvlan6kek3nj18a.apps.googleusercontent.com",
  client_secret: 
  "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",
  refresh_token: 
  "1//01jvrpAPaIwa1CgYIARAAGAESNwF-L9IrEzuiNUI-88OW9tW1fX_HZf1MgOoFlPOcBkzxK69eCPXdZBzoavpweWQFBiJaiQUqfvM",
  scope: "https://www.googleapis.com/auth/spreadsheets",
  token_type: "Bearer",
});

const sheets = google.sheets({ version: "v4", auth: oAuth2Client });



/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1PjcGC1UV0LPKSBoY0JovvwODKC-S81DB6Pyjjw_Kdkg/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function listMajors() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: '1PjcGC1UV0LPKSBoY0JovvwODKC-S81DB6Pyjjw_Kdkg',
    range: 'Products!A2:E',
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log('No data found.');
    return;
  }
  console.log('Name, Major:');
  rows.forEach((row) => {
    // Print columns A and E, which correspond to indices 0 and 4.
    console.log(`${row[0]}, ${row[4]}`);
  });
}

async function read() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: "1PjcGC1UV0LPKSBoY0JovvwODKC-S81DB6Pyjjw_Kdkg", // Reemplaza aquí con el nuevo spreadsheetId
    range: "Products!A2:E",
  });

  const rows = response.data.values;
  const products = rows.map((row) => ({
    id: +row[0],
    name: row[1],
    price: +row[2],
    image: row[3],
    stock: +row[4],
  }));

  return products;
}

async function write(products) {
  let values = products.map((p) => [p.id, p.name, p.price, p.image, p.stock]);

  const resource = {
    values,
  };
  const result = await sheets.spreadsheets.values.update({
    spreadsheetId: "1PjcGC1UV0LPKSBoY0JovvwODKC-S81DB6Pyjjw_Kdkg", // Reemplaza aquí con el nuevo spreadsheetId
    range: "Products!A2:E",
    valueInputOption: "RAW",
    resource,
  });

  console.log(result.updatedCells);
}

read();
module.exports = {
  read,
  write,
};