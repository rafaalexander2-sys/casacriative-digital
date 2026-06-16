/**
 * Script para gerar o Refresh Token do Google Ads OAuth2
 *
 * COMO USAR:
 *   1. Preencha CLIENT_ID e CLIENT_SECRET abaixo (do Google Cloud Console)
 *   2. Execute: node get-token.js
 *   3. Abra a URL que aparecer no browser
 *   4. Faça login com a conta da MCC (nowaperformance@gmail.com ou similar)
 *   5. Cole o código de autorização no terminal
 *   6. O refresh_token vai aparecer — copie para o .env
 */

import https from "https";
import readline from "readline";

const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID || "COLE_SEU_CLIENT_ID_AQUI";
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET || "COLE_SEU_CLIENT_SECRET_AQUI";
const SCOPE = "https://www.googleapis.com/auth/adwords";
const REDIRECT_URI = "urn:ietf:wg:oauth:2.0:oob";

const authUrl =
  `https://accounts.google.com/o/oauth2/auth` +
  `?client_id=${CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&scope=${encodeURIComponent(SCOPE)}` +
  `&response_type=code` +
  `&access_type=offline` +
  `&prompt=consent`;

console.log("\n=== Google Ads OAuth2 — Gerador de Refresh Token ===\n");
console.log("1. Abra esta URL no browser:\n");
console.log(authUrl);
console.log("\n2. Faça login com a conta que gerencia a MCC 710-695-1176");
console.log("3. Autorize o acesso e copie o código que aparecer\n");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question("Cole o código de autorização aqui: ", (code) => {
  rl.close();

  const postData = new URLSearchParams({
    code: code.trim(),
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  }).toString();

  const req = https.request(
    {
      hostname: "oauth2.googleapis.com",
      path: "/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
      },
    },
    (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const json = JSON.parse(data);
        if (json.refresh_token) {
          console.log("\n✓ Sucesso! Adicione isto ao seu .env:\n");
          console.log(`GOOGLE_ADS_REFRESH_TOKEN=${json.refresh_token}`);
          console.log("\nGuarde este token em local seguro — não o commite no git!\n");
        } else {
          console.error("\n✗ Erro ao obter token:", json);
        }
      });
    }
  );

  req.on("error", (e) => console.error("Erro de rede:", e));
  req.write(postData);
  req.end();
});
