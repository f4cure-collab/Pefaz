<?php
require_once __DIR__ . '/_auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method not allowed');
}

csrf_check();

$action = $_POST['action'] ?? '';
$users = load_users();
$me = current_user_username();

switch ($action) {

    case 'add': {
        $username = trim($_POST['username'] ?? '');
        $name     = trim($_POST['name'] ?? '');
        $password = $_POST['password'] ?? '';
        $confirm  = $_POST['password_confirm'] ?? '';

        // Memoriza valores pra repreencher form em caso de erro
        $_SESSION['form_prev'] = ['username' => $username, 'name' => $name];

        if (strlen($username) < 3 || !preg_match('/^[a-zA-Z0-9_-]+$/', $username)) {
            set_flash('error', 'Usuário inválido. Mínimo 3 caracteres, apenas letras, números, _ e -.');
            header('Location: usuario-novo.php');
            exit;
        }
        if (strlen($password) < 8) {
            set_flash('error', 'Senha precisa ter ao menos 8 caracteres.');
            header('Location: usuario-novo.php');
            exit;
        }
        if ($password !== $confirm) {
            set_flash('error', 'As duas senhas digitadas não conferem.');
            header('Location: usuario-novo.php');
            exit;
        }
        // Username único?
        foreach ($users as $u) {
            if (($u['username'] ?? '') === $username) {
                set_flash('error', 'Já existe um usuário com esse nome.');
                header('Location: usuario-novo.php');
                exit;
            }
        }

        $users[] = [
            'username'      => $username,
            'password_hash' => password_hash($password, PASSWORD_BCRYPT),
            'name'          => $name ?: $username,
            'role'          => 'admin',
            'created_at'    => date('Y-m-d H:i:s'),
        ];
        save_users($users);
        unset($_SESSION['form_prev']);
        set_flash('success', '✓ Usuário "' . $username . '" criado.');
        header('Location: usuarios.php');
        exit;
    }

    case 'delete': {
        $target = trim($_POST['username'] ?? '');
        if ($target === '') {
            set_flash('error', 'Usuário não informado.');
            header('Location: usuarios.php');
            exit;
        }
        if ($target === $me) {
            set_flash('error', 'Você não pode deletar a si mesmo.');
            header('Location: usuarios.php');
            exit;
        }
        if (count($users) <= 1) {
            set_flash('error', 'Não pode remover o último usuário (você ficaria sem acesso).');
            header('Location: usuarios.php');
            exit;
        }

        $found = false;
        $new_users = [];
        foreach ($users as $u) {
            if (($u['username'] ?? '') === $target) {
                $found = true;
                continue;
            }
            $new_users[] = $u;
        }
        if (!$found) {
            set_flash('error', 'Usuário não encontrado.');
            header('Location: usuarios.php');
            exit;
        }
        save_users($new_users);
        set_flash('success', '✓ Usuário "' . $target . '" removido.');
        header('Location: usuarios.php');
        exit;
    }

    case 'self_name': {
        $name = trim($_POST['name'] ?? '');
        if ($name === '') {
            set_flash('error', 'Nome não pode ficar vazio.');
            header('Location: meus-dados.php');
            exit;
        }
        foreach ($users as &$u) {
            if (($u['username'] ?? '') === $me) {
                $u['name'] = $name;
                $_SESSION['admin_name'] = $name;
                break;
            }
        }
        unset($u);
        save_users($users);
        set_flash('success', '✓ Nome atualizado.');
        header('Location: meus-dados.php');
        exit;
    }

    case 'self_password': {
        $current = $_POST['current_password'] ?? '';
        $new     = $_POST['new_password'] ?? '';
        $confirm = $_POST['new_password_confirm'] ?? '';

        if (strlen($new) < 8) {
            set_flash('error', 'Nova senha precisa ter ao menos 8 caracteres.');
            header('Location: meus-dados.php');
            exit;
        }
        if ($new !== $confirm) {
            set_flash('error', 'As duas senhas novas não conferem.');
            header('Location: meus-dados.php');
            exit;
        }

        $me_user = find_user($me ?? '');
        if (!$me_user || !password_verify($current, $me_user['password_hash'] ?? '')) {
            sleep(1);
            set_flash('error', 'Senha atual incorreta.');
            header('Location: meus-dados.php');
            exit;
        }

        foreach ($users as &$u) {
            if (($u['username'] ?? '') === $me) {
                $u['password_hash'] = password_hash($new, PASSWORD_BCRYPT);
                break;
            }
        }
        unset($u);
        save_users($users);
        set_flash('success', '✓ Senha trocada.');
        header('Location: meus-dados.php');
        exit;
    }

    default:
        http_response_code(400);
        die('Ação inválida.');
}
