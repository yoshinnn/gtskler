```bash
# create and launch development environment
bundle exec rails s -p 3000 -b '0.0.0.0'

# railsコンテナに入る
docker-compose exec rails sh

# MySqlコンテナに入る
docker-compose exec mysql sh
```

### generate Controller
コントローラーを作成して，ルーティング（/config/routes.rb）を編集すれば使えるようになります．
```bash
# railsコンテナに入る
docker-compose exec rails sh

bundle exec rails generate controller コントローラ名
# 例
bundle exec rails generate controller Home
```

### make Model
```bash
# railsコンテナに入る
docker-compose exec rails sh

# モデルを作成する
# モデルが作成された際に、マイグレーションファイル（DBの設計図のようなもの）も作成されます
bundle exec rails generate model モデル名

# 例 : Avatorモデルの作成
bundle exec rails generate model Avator

# migrate（MySQLにマイグレーションファイルの内容を適応する）
bundle exec rails db:migrate

-----------------------------
# カラムを追加する
bundle exec rails generate migration Addカラム名Toテーブル名
# 例 : Userモデルにnameカラムを追加
bundle exec rails generate migration AddNameToUsers
# 例 : Userモデルに複数のカラムを追加
bundle exec rails generate migration AddBasicInfoToUsers

# カラムを削除する
bundle exec rails g migration Removeカラム名Fromテーブル名

# migrate（MySQLにマイグレーションファイルの内容を適応する）
bundle exec rails db:migrate
```

### seedデータ（初期データ）の作り方
```bash
docker-compose exec rails sh

# db/seeds.rbを編集 : 参考にすること
bundle exec rails db:seed
```

#### 参考
- [コントローラの作成と命名規則(命名規約)](https://www.javadrive.jp/rails/controller/index1.html)
- [Rails generate の使い方とコントローラーやモデルの命名規則](https://qiita.com/higeaaa/items/96c708d01a3dbb161f20)

### ブランチのきり方
```bash
# feature/#1ブランチが作成され，自身もブランチの先へ移行する
git checkout -b feature/#1

# ブランチの切り替え
git checkout develop
```