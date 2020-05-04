class CreateStockTimes < ActiveRecord::Migration[6.0]
  def change
    create_table :stock_times, id: false do |t|
      t.primary_key :stamp_id
      t.datetime :stamp
    end
  end
end
