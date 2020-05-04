class CreateStockPrices < ActiveRecord::Migration[6.0]
  def change
    create_table :stock_prices, id: false do |t|
      t.primary_key :price_id
      t.integer :name_id
      t.decimal :price
      t.integer :stamp_id
    end
  end
end
