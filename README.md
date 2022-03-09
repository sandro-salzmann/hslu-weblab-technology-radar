# hslu-weblab-technology-radar

Ein Werkzeug für Technologie-Management geschrieben im PERN-Stack.

## Setup dev environment

Um das Programm zu starten müssen folgende Schritte durchführt werden:

1. Auth0-Umgebung erstellen
   - Unter Actions ➔ Flows ➔ Login ➔ nach Einstiegspunkt "Start - User Logged in" folgende Actions erstellen:
     1. [add-uuid-to-app-metadata Action](auth0\add-uuid-to-app-metadata.action.js)
     2. [add-user-metadata-to-idtoken Action](auth0\add-user-metadata-to-idtoken.action.js)
     3. [add-uuid-to-idtoken Action](auth0\add-uuid-to-idtoken.action.js)
2. Umgebungen anpassen

   - web-app/.env.development.local (Beispiel: [web-app/.env.example](web-app/.env.example))
   - technology-service/.env (Beispiel: [technology-service/.env.example](technology-service/.env.example))
   - account-service/.env (Beispiel: [account-service/.env.example](account-service/.env.example))
   - authorization-service/.env (Beispiel: [authorization-service/.env.example](authorization-service/.env.example))
   - api-gateway/.env (Beispiel: [api-gateway/.env.example](api-gateway/.env.example))

3. PostgreSQL v14.2 installieren und Schemas laden
   - [Account Schema](account-service\db\schema.sql) laden
   - [Technology Schema](technology-service\db\schema.sql) laden
4. Module starten

   Account Service

   ```bash
   cd ./account-service
   npm i
   npm run dev
   ```

   Technology Service

   ```bash
   cd ./technology-service
   npm i
   npm run dev
   ```

   Authorization Service

   ```bash
   cd ./authorization-service
   npm i
   npm run dev
   ```

   API Gateway

   ```bash
   cd ./api-gateway
   npm i
   npm run dev
   ```

   WebApp

   ```bash
   cd ./web-app
   npm i
   npm run start
   ```
