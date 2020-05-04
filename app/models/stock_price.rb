class StockPrice < ApplicationRecord
    validates :name_id, presence: true
    validates :price, presence: true
    validates :stamp_id, presence: true
    ####################################################
    belongs_to :stock_name, :primary_key => :id, :foreign_key => :name_id
    belongs_to :stock_time, :primary_key => :stamp_id, :foreign_key => :stamp_id
    ####################################################
    scope :summary, -> () { 
        where( stamp_id: StockTime.lastTimeID).joins( :stock_name).select( 
            'stock_names.companyName', 'stock_names.symbol', :change_pct) 
    }

    scope :getHistoryOf, -> (name_id) {
        select( :price, :change_pct, 'stock_times.stamp').joins( :stock_time).
            where( name_id: name_id)
    }

end
