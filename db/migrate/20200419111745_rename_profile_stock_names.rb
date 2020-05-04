class RenameProfileStockNames < ActiveRecord::Migration[6.0]
  def change
    change_table :stock_names do |t|
      t.rename :name, :companyName
      t.string :exchange
      t.string :industry
      t.string :website
      t.text :description
      t.string :ceo
      t.string :sector
      t.string :image
      t.string :exchangeShortName
    end
  end
end