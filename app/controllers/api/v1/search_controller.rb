class Api::V1::SearchController < ApplicationController
  class_attribute :docMatcher 
  @@docMatcher = nil

  def post
    return if @@docMatcher.nil? && ! bootDocMatcher
    words = queryWords["words"].gsub( /[^0-9a-z ]/i, '').downcase
    @@docMatcher.puts words
    ids = @@docMatcher.gets.split.map( &:to_i)
    render json: StockName.findIds( ids)
  end

  private 
  def queryWords
    JSON.parse( request.body.read())["query"]
  end

  def bootDocMatcher
    begin
      @@docMatcher = IO.popen("./bin/documentMatch #{
        Rails.configuration.x.docMatcher.data} #{
        Rails.configuration.x.docMatcher.searchLimit}", "r+")
      puts "\e[0;32mDocument match boot: Document matcher is up!\e[0m"
    rescue Exception => e
      puts "\e[0;31mCould not boot documentMatcher!\e[0m"
      render json: {
        status: :internal_server_error,
        error: "Something went wrong with our searching engine! =("
      }, status: :internal_server_error
      return false
    end
    return true
  end
end
