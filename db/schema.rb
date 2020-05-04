# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_04_25_010518) do

  create_table "stock_names", force: :cascade do |t|
    t.string "companyName"
    t.string "symbol"
    t.string "currency"
    t.string "location"
    t.string "exchange"
    t.string "industry"
    t.string "website"
    t.text "description"
    t.string "ceo"
    t.string "sector"
    t.string "image"
    t.string "exchangeShortName"
  end

  create_table "stock_prices", primary_key: "price_id", force: :cascade do |t|
    t.integer "name_id"
    t.decimal "price"
    t.integer "stamp_id"
    t.decimal "change_pct"
  end

  create_table "stock_times", primary_key: "stamp_id", force: :cascade do |t|
    t.datetime "stamp"
  end

  create_table "user_likes", force: :cascade do |t|
    t.integer "user_id"
    t.integer "name_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "username"
    t.string "email"
    t.string "password_digest"
    t.boolean "active", default: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

end
