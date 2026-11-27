# Verify Squidex content survives a local Compose rebuild

A container can be healthy even when published content resides on a disposable filesystem. In this lab, you will create a release note through the Squidex API, replace both containers, and read the same note by ID. The resulting check covers the application, its identity server, and the database volume together.

Run the lab in a new directory with Docker Compose and PowerShell 7. The example uses Squidex 7.24.0 and MongoDB 7.0.45. It binds the application to loopback and leaves MongoDB without a published port. Use the lab for synthetic data on your own machine.

## Start the two services

Save this file as `compose.yaml`.

```yaml
services:
  mongo:
    image: mongo:7.0.45
    volumes:
      - mongo-data:/data/db
    healthcheck:
      test: [CMD, mongosh, --quiet, --eval, 'quit(db.adminCommand({ping: 1}).ok === 1 ? 0 : 1)']
      interval: 5s
      timeout: 5s
      retries: 18

  squidex:
    image: squidex/squidex:7.24.0
    depends_on:
      mongo:
        condition: service_healthy
    ports:
      - 127.0.0.1:8287:8287
    environment:
      ASPNETCORE_URLS: http://+:8287
      URLS__BASEURL: http://127.0.0.1:8287
      EVENTSTORE__MONGODB__CONFIGURATION: mongodb://mongo:27017
      STORE__MONGODB__CONFIGURATION: mongodb://mongo:27017
      IDENTITY__ADMINCLIENTID: local-lab
      IDENTITY__ADMINCLIENTSECRET: ${SQUIDEX_LAB_SECRET:?Set SQUIDEX_LAB_SECRET before starting the lab}
      IDENTITY__SHOWPII: 'false'
      IDENTITY__GOOGLECLIENT: ''
      IDENTITY__GOOGLESECRET: ''
      IDENTITY__GITHUBCLIENT: ''
      IDENTITY__GITHUBSECRET: ''
      IDENTITY__MICROSOFTCLIENT: ''
      IDENTITY__MICROSOFTSECRET: ''
    volumes:
      - asset-data:/app/Assets
    healthcheck:
      test: [CMD, curl, -fsS, http://127.0.0.1:8287/healthz]
      interval: 5s
      timeout: 5s
      start_period: 20s
      retries: 24

volumes:
  mongo-data:
  asset-data:
```

The MongoDB health check gives Squidex a ready database when it starts. Using the same application port in the container and on the host lets the API and its client use the same loopback issuer URL. The two named volumes keep database records and file assets outside their respective containers. This exercise verifies content records.

Run all the following commands in the same PowerShell session. Generate a temporary administrative client secret for this local lab. Use a restricted app client in application code and keep this lab secret out of source control.

```powershell
$ErrorActionPreference = 'Stop'
$project = 'squidex-content-lab'
$base = 'http://127.0.0.1:8287'
$env:SQUIDEX_LAB_SECRET = [Convert]::ToHexString(
    [System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32)
)

docker compose -p $project up -d --wait --wait-timeout 120
if ($LASTEXITCODE -ne 0) { throw 'The lab services did not become healthy.' }
docker compose -p $project ps
```

Both services should report healthy. Check the listed port for Squidex if your setup already uses port 8287.

## Publish and read one note

Get an access token through the client credentials flow. The function holds the access token in memory so the subsequent API commands can use it. [API authentication](../../02-documentation/developer-guides/api-overview/authentication.md)

```powershell
function Get-LabToken {
    $token = Invoke-RestMethod -Method Post `
        -Uri "$base/identity-server/connect/token" `
        -ContentType 'application/x-www-form-urlencoded' `
        -Body @{
            grant_type = 'client_credentials'
            scope = 'squidex-api'
            client_id = 'local-lab'
            client_secret = $env:SQUIDEX_LAB_SECRET
        }
    return $token.access_token
}

$headers = @{ Authorization = "Bearer $(Get-LabToken)" }
$null = Invoke-RestMethod -Method Post -Uri "$base/api/apps" `
    -Headers $headers -ContentType 'application/json' `
    -Body '{"name":"release-notes-lab"}'

$schema = @'
{
  "name": "notes",
  "isPublished": true,
  "fields": [
    {
      "name": "title",
      "partitioning": "invariant",
      "properties": {"fieldType": "String", "isRequired": true}
    }
  ]
}
'@

$null = Invoke-RestMethod -Method Post `
    -Uri "$base/api/apps/release-notes-lab/schemas" `
    -Headers $headers -ContentType 'application/json' -Body $schema

$notes = "$base/api/content/release-notes-lab/notes"
$note = Invoke-RestMethod -Method Post -Uri "${notes}?status=Published" `
    -Headers $headers -ContentType 'application/json' `
    -Body '{"title":{"iv":"Keep a local release note"}}'

$noteUri = "$notes/$($note.id)"
$before = Invoke-RestMethod -Uri $noteUri -Headers $headers
if ($before.status -ne 'Published' -or
    $before.data.title.iv -ne 'Keep a local release note') {
    throw 'The initial read did not return the expected published note.'
}
$before | Select-Object id, status
```

The schema has one field shared across languages. Its invariant partition uses the `iv` key in content JSON. Keep the value of `$noteUri` for the second read. Querying this exact ID helps distinguish the original record from one recreated with the same title.

## Replace the containers and compare the record

Take the stack down without removing volumes and start it again. A change in the application container ID verifies that the command replaced the container. Pulling a fresh token after the rebuild also checks that the client credentials flow still works.

```powershell
$oldContainer = docker compose -p $project ps -q squidex
docker compose -p $project down
if ($LASTEXITCODE -ne 0) { throw 'The lab stack did not stop.' }

docker compose -p $project up -d --wait --wait-timeout 120
if ($LASTEXITCODE -ne 0) { throw 'The rebuilt services did not become healthy.' }

$newContainer = docker compose -p $project ps -q squidex
if (-not $oldContainer -or -not $newContainer -or $oldContainer -eq $newContainer) {
    throw 'Could not verify that Compose replaced the Squidex container.'
}

$headers = @{ Authorization = "Bearer $(Get-LabToken)" }
$after = Invoke-RestMethod -Uri $noteUri -Headers $headers
if ($after.id -ne $before.id -or
    $after.status -ne $before.status -or
    $after.data.title.iv -ne $before.data.title.iv) {
    throw 'The note changed or disappeared after rebuilding the stack.'
}
"Verified the published note after rebuilding: $($after.id)"
```

If the first read fails, check that both the schema and the item are published. If the second read fails, check that you restarted the same Compose project and kept its `mongo-data` volume. That volume holds the database state this test exercises. [Content states](../../02-documentation/concepts/content/README.md)

## Clean up the lab

Stop the project with `docker compose -p $project down` to keep the example record. When you want to discard the example, the following command removes the lab containers and both of its named volumes. Run it from the same directory and only for this disposable project.

```powershell
docker compose -p $project down --volumes
if ($LASTEXITCODE -ne 0) { throw 'The lab stack did not clean up.' }
Remove-Item Env:SQUIDEX_LAB_SECRET
```
