class StockTime < ApplicationRecord
    validates :stamp, presence: true
    ######################################################
    has_many :stock_prices, :foreign_key => :stamp_id
    ######################################################
    scope :recentest, -> () { order( 'stamp DESC').first }
    scope :lastTimeID, -> () { select( :stamp_id).recentest }
    scope :lastTime, -> () { select( :stamp).recentest }

    scope :lastDayID, -> () { select( :stamp_id).where( 
        "stamp > '#{StockTime.lastDay}'" ) }

    private
    
    def self.lastDay
        StockTime.recentest.stamp.to_date.to_s
    end

end
