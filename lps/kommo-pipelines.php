<?php
// Script auxiliar — listar pipelines e status da conta Kommo
// ACESSE UMA VEZ, pegue os IDs, depois DELETE este arquivo.

$token = 'SEU_TOKEN_AQUI'; // cole aqui o token de longa duração

$ch = curl_init('https://allasercursos.kommo.com/api/v4/leads/pipelines');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json',
    ],
]);
$response = curl_exec($ch);
$data = json_decode($response, true);
curl_close($ch);

echo '<pre style="background:#111;color:#cfc;padding:20px;font-size:13px;">';
foreach ($data['_embedded']['pipelines'] ?? [] as $pipeline) {
    echo "=== PIPELINE: [{$pipeline['id']}] {$pipeline['name']} ===\n";
    foreach ($pipeline['_embedded']['statuses'] ?? [] as $status) {
        echo "   STATUS: [{$status['id']}] {$status['name']}\n";
    }
    echo "\n";
}
echo '</pre>';
