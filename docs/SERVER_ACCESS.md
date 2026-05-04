# StepBy ローカルサーバー アクセス手順

このドキュメントは、StepByプロジェクトのローカルLinuxサーバーへSSH接続して開発作業を行うための手順をまとめたものです。

## プロジェクト構成

StepByプロジェクトは以下の3つのリポジトリから構成されています。

| リポジトリ | 場所 | 役割 |
| --- | --- | --- |
| **HP** (`StepBy_HP`) | Windows側のみ：`C:\Users\kumak\Documents\github\StepBy_HP` | プロジェクト紹介ホームページ |
| **バックエンド** (`barrierfree-map`) | Linuxサーバー：`/home/otama/barrierfree-map` | API・データ処理 |
| **フロントエンド（スマホアプリ）** (`StepBy`) | Linuxサーバー：`/home/otama/StepBy` | スマホアプリ本体 |

HPリポジトリはWindows側だけで完結しますが、フロントエンド・バックエンドはLinuxサーバー上で開発・動作します。3者のAPIや表記内容に整合を取りながら開発するため、Windowsから同サーバーへSSH接続して横断的に作業します。

## サーバー接続情報

| 項目 | 値 |
| --- | --- |
| ホスト | `192.168.50.7`（ホスト名 `thinkcentre-m73`） |
| ユーザー名 | `otama` |
| SSHポート | `22`（デフォルト） |
| 許可される認証方式 | **公開鍵認証（ed25519） と パスワード認証 の両方** |

サーバーの sshd 設定で `PubkeyAuthentication yes` と `PasswordAuthentication yes` が両方有効になっています。普段は鍵認証で接続し、鍵が使えない非常時はパスワードで入れる構成です。

## SSH鍵の配置（Windows側）

| 種別 | パス |
| --- | --- |
| 秘密鍵 | `C:\Users\kumak\Documents\keys\localserver_key\localserver_key` |
| 公開鍵 | `C:\Users\kumak\Documents\keys\localserver_key\localserver_key.pub` |

**秘密鍵にパスフレーズは設定していません。** これはClaude Code（このAIエージェント）が非対話的にSSHを使えるようにするための判断です。Windowsのユーザーログインがファイルへのアクセス制御を担っており、ローカルLAN内のローカルサーバーへの踏み台用途では許容範囲とみなしています。

**注意：** 秘密鍵は絶対にリポジトリにコミットしたり外部に共有しないでください。

## SSH config（設定済み）

`C:\Users\kumak\.ssh\config` には下記のエントリが設定済みです。`ssh stepby-server` または `ssh otama@192.168.50.7` のどちらでも鍵認証で接続できます。

```ssh-config
Host 192.168.50.7
    HostName 192.168.50.7
    User otama
    IdentityFile C:\Users\kumak\Documents\keys\localserver_key\localserver_key
    IdentitiesOnly yes

Host stepby-server
    HostName 192.168.50.7
    User otama
    Port 22
    IdentityFile C:\Users\kumak\Documents\keys\localserver_key\localserver_key
    IdentitiesOnly yes
```

## 公開鍵認証セットアップの実施手順（履歴・再構築用）

新しいPCで同じ構成を作る、あるいは鍵を再発行する際の手順を残します。

### 1. Windows側で鍵ペアを生成

```powershell
ssh-keygen -t ed25519 -f "C:\Users\kumak\Documents\keys\localserver_key\localserver_key" -C "kumak@windows-to-localserver"
```

パスフレーズは何も入力せずEnterで進める（非対話SSHを成立させるため）。

### 2. 公開鍵をLinuxサーバーへ転送

サーバー側にSSH接続（パスワード認証）した状態で、`~/.ssh/authorized_keys` に公開鍵を1行で追記します。

**重要：PowerShellの `type` コマンドでパイプすると改行コードが CRLF に変換され、`\r` が混入して認証が失敗します。** 以下のいずれか安全な方法を使ってください。

**方法A：scp で送ってからサーバー側で追記**

```powershell
scp "C:\Users\kumak\Documents\keys\localserver_key\localserver_key.pub" otama@192.168.50.7:/tmp/pubkey.pub
ssh otama@192.168.50.7
```

サーバー側で：

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
cat /tmp/pubkey.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
sed -i 's/\r$//' ~/.ssh/authorized_keys   # 念のため CRLF を除去
rm /tmp/pubkey.pub
```

**方法B：もし `type | ssh ... cat >>` で追記してしまった場合の修復**

```bash
sed -i 's/\r$//' ~/.ssh/authorized_keys
od -c ~/.ssh/authorized_keys | tail -3   # 行末が \n のみであることを確認（\r が無いこと）
```

### 3. サーバー側のパーミッションを確認

```bash
ls -ld ~ ~/.ssh ~/.ssh/authorized_keys
```

期待値：
```
drwxr-x--- ... /home/otama              （ホーム: 750以下）
drwx------ ... /home/otama/.ssh         （700）
-rw------- ... /home/otama/.ssh/authorized_keys （600）
```

ホームディレクトリがグループまたはothersに書き込み可だと sshd が鍵認証を拒否します。

### 4. sshd 設定を確認

```bash
sudo sshd -T | grep -Ei "passwordauthentication|pubkeyauthentication"
```

両方とも `yes` であること。

### 5. 鍵認証で接続テスト

Windows側から：

```powershell
ssh stepby-server "echo pubkey_auth_ok && whoami && hostname"
```

`pubkey_auth_ok` が出れば成功です。

## 日常の接続コマンド

### 通常のシェルログイン

```powershell
ssh stepby-server
```

### バックエンド作業ディレクトリへ直接入る

```powershell
ssh stepby-server -t "cd /home/otama/barrierfree-map && bash"
```

### フロントエンド作業ディレクトリへ直接入る

```powershell
ssh stepby-server -t "cd /home/otama/StepBy && bash"
```

### ファイル転送（scp）

```powershell
# Windows → サーバー
scp <ローカルパス> stepby-server:<サーバー上のパス>

# サーバー → Windows
scp stepby-server:<サーバー上のパス> <ローカルパス>
```

## 開発の進め方（横断作業）

3リポジトリ間で整合を取りながら開発するため、典型的な作業の流れは以下のようになります。

1. **Windows側** で HPリポジトリを編集（このリポジトリ）
2. **SSH接続後** にバックエンドリポジトリでAPIを編集 → 動作確認
3. **SSH接続後** にフロントエンドリポジトリでAPI連携部分を更新 → 動作確認
4. APIのバージョン番号や仕様をHPの説明と一致させる

## トラブルシューティング

### `Permission denied (publickey,password)` が出る

切り分けの順番：

1. **サーバー側の authorized_keys に CRLF が混入していないか**
   ```bash
   od -c ~/.ssh/authorized_keys | tail -3
   ```
   行末が `\r \n` になっていたら `sed -i 's/\r$//' ~/.ssh/authorized_keys` で除去。

2. **サーバー側のパーミッション**
   ```bash
   ls -ld ~ ~/.ssh ~/.ssh/authorized_keys
   ```
   ホーム=750以下、`.ssh`=700、`authorized_keys`=600。

3. **クライアント側の秘密鍵にパスフレーズが残っていないか**
   ```powershell
   ssh-keygen -y -P "" -f "C:\Users\kumak\Documents\keys\localserver_key\localserver_key"
   ```
   `incorrect passphrase supplied` と出たらパスフレーズが残っている。下記で削除：
   ```powershell
   ssh-keygen -p -f "C:\Users\kumak\Documents\keys\localserver_key\localserver_key"
   ```
   旧パスフレーズを入力 → 新パスフレーズは空Enter ×2。

4. **詳細ログを見る**
   ```powershell
   ssh -v -o BatchMode=yes stepby-server "echo test"
   ```
   `Server accepts key` の後に `Authentications that can continue` が出ない場合は、署名段階で失敗（パスフレーズ問題が濃厚）。`Server accepts key` 自体が出ない場合は authorized_keys 側の問題。

### `Connection refused` または `Connection timed out` が出る

- サーバーが起動しているか
- IPアドレス（`192.168.50.7`）が変わっていないか（サーバー側で `ip a` 確認）
- 同じLAN内にいるか
- サーバー側のファイアウォールが22番ポートを許可しているか

### 鍵のパーミッションエラー（Windows）

Windowsで秘密鍵が他ユーザーから読める状態だと警告が出ることがあります。Administrators や SYSTEM のフルアクセスは通常そのままでも動作しますが、警告が出る場合は鍵ファイルのプロパティ → セキュリティから自ユーザー以外のアクセス権を削除してください。

## セキュリティ補足

現在は鍵認証とパスワード認証の両方を許可しています。鍵認証の利便性を確認できた今、よりセキュアにしたい場合はサーバー側で `/etc/ssh/sshd_config.d/99-stepby-auth.conf` 等で：

```
PasswordAuthentication no
PubkeyAuthentication yes
```

を設定することでパスワード認証を無効化できます。実施時は **必ず別セッションで鍵ログインできることを確認してから** `sudo systemctl reload ssh` してください（締め出されると物理アクセスが必要になります）。
