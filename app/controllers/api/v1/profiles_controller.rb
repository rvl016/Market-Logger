class Api::V1::ProfilesController < ApplicationController
  def index
    profiles = StockName.getTodayPrices.sample 500
    render json: profiles
  end

  def show
    profileData = StockName.getDataFrom params[:symbol]
    return render json: {
      status: "Bad Request",
      error: "Symbol #{params[:symbol]} not found! =("
    }, status: :bad_request unless profileData
    pp params[:symbol]
    stockData = StockPrice.getHistoryOf profileData.id
    render json: { profile: profileData, stockData: stockData}.as_json
  end
end
