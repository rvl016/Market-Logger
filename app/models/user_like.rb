class UserLike < ApplicationRecord

  belongs_to :user, :primary_key => :id, :foreign_key => :user_id
  has_many :stock_names, :primary_key => :name_id, :foreign_key => :id

  scope :getUserLikes, -> (id) {
    select( :name_id).where( user_id: id)
  }
end
