class Api::V1::SummaryController < ApplicationController
  def index
    summary = StockPrice.summary.sample 50
    render json: summary
  end

  def show

  end
end
