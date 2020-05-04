class CreateUserLikes < ActiveRecord::Migration[6.0]
  def change
    create_table :user_likes do |t|
      t.integer :user_id
      t.integer :name_id

      t.timestamps
    end
  end
end
