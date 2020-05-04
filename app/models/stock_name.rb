class StockName < ApplicationRecord

    validates :companyName, presence: true
    validates :symbol, presence: true
    validates_uniqueness_of :symbol, :if => :new_record?

    has_many :stock_prices, :primary_key => :id, :foreign_key => :name_id, 
        :dependent => :destroy
    ########################################################################
    scope :findCompany, -> (name) { where( "companyName LIKE '%?%'", name) }

    scope :getStock, -> (symbol) { 
        select( "stock_prices.price", "stock_times.stamp").where( 
            symbol: symbol).joins( :stock_prices, :stock_times) 
    }

    scope :getTodayPrices, -> () { 
        select( :id, :companyName, :symbol, 'stock_prices.change_pct', 'stock_prices.price', 
        :location, :exchange, :industry, :website, :description, :ceo, :sector, 
        :image ).joins( :stock_prices).where( 'stock_prices.stamp_id': 
        StockTime.lastDayID).where.not( 'stock_prices.change_pct': nil).group(
        :symbol)
    }

    scope :getPositiveStandout, -> () { 
        getTodayPrices.order( change_pct: :desc)
    }

    scope :getNegativeStandout, -> () { 
        getTodayPrices.order( :change_pct)
    }

    scope :findIds, -> (ids) {
        select( :id, :companyName, :symbol, :location, :exchange, :sector,
            :industry, :description, :image ).find( ids)
    }

    def self.getDataFrom( symbol) 
        StockName.select( :id, :companyName, :symbol, :location, :exchange, :industry, 
        :website, :description, :ceo, :sector, :image ).find_by( symbol: symbol)
    end
end
