class Api::V1::StandoutsController < ApplicationController
  def index
    posStandouts = StockName.getPositiveStandout.take 12
    negStandouts = StockName.getNegativeStandout.take 12
    render json: { positive: posStandouts, negative: negStandouts }.as_json
  end
end
