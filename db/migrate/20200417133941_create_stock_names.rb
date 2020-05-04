class CreateStockNames < ActiveRecord::Migration[6.0]
  def change
    create_table :stock_names, id: false do |t|
      t.primary_key :id
      t.string :name
      t.string :symbol
      t.string :currency
      t.string :location
    end
  end
end
