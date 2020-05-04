class DropStocksTable < ActiveRecord::Migration[6.0]
  def up
    drop_table :stocks
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
