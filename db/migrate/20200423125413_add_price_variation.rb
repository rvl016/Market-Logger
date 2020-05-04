class AddPriceVariation < ActiveRecord::Migration[6.0]
  def change
    add_column :stock_prices, :change_pct, :decimal
  end
end
