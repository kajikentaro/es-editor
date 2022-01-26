## 就活 ES エディター

就活生のためのエントリーシートエディター
https://es-editor.kajindowsxp.com

## Feature

- バージョン管理<br/>変更履歴をすべて保存し、好きなバージョンにロールバック,
- 検索機能<br/>文章中の文字、企業名、項目名を併せて検索,
- 企業、項目別管理<br/>「ガクチカ」「長所」「志望動機」などの項目ラベルを付けて、まとめて管理,
- 文字数カウント<br/>一文字入力するごとにリアルタイム表示。(coming soon)更に指定文字数の目安となる目印を表示,
- ローカル保存 | (coming soon)クラウド保存<br/>端末内かクラウド、またはその両方に書いたデータを保存。更に word 形式でダウンロードすることも可能,
- (coming soon)コメントアウト機能<br/>一瞬思いついた語彙を逃さず保存。コメントとして記入することで、ダウンロードやまとめてコピー時にはその部分を無視して取得できます。

## How to Dev

1. このリポジトリをクローンします
1. `/backend/.env.template`を`/backend/.env`にコピーします。
1. Google の client id と client secret を取得し、`/backend/.env`に記載します
1. 下記を参考に開発用環境を作成してください

## Docker Compose

### prod_front

本番環境 Web サーバー(Next.js).  
`localhost:3000`(自動的に起動)

### prod_back

本番環境 Backend サーバー(Flask)  
`localhost:5000`(自動的に起動)

### dev_front

フロント用開発環境  
`/root/es-editor/frontend`で`yarn dev`コマンド

### dev_back

バックエンド用開発環境  
`/root/es-editor/backend`で`python app.py`コマンド

### 例

- `docker-compose up prod_back dev_front`  
  フロントエンドのみ開発する場合
- `docker-compose up prod_front dev_back`  
  バックエンドのみ開発する場合
- `docker-compose --profile dev`  
  両方を開発環境とすることもできます

## How to Prod

1. このリポジトリをクローンします
1. `/backend/.env.template`を`/backend/.env`にコピーします。
1. Google の client id と client secret を取得し、`/backend/.env`に記載します
1. `docker-compose --profile prod up`を実行
1. `localhost:3000` に Web サーバー、`localhost:5000` にバックエンドサーバーが立ちます
