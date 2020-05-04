namespace :stock_db do
  desc "Sync database to new stock data."
  task boot: :environment do
    prices = HTTParty.get( 
      "https://financialmodelingprep.com/api/v3/stock/real-time-price")
    if prices.code == 200
      stampId = StockTime.create!( stamp: DateTime.current()).stamp_id
      prices["stockList"].each do |price| 
        symbol = price["symbol"]
        name = StockName.find_by( symbol: symbol)
        if ! name
          profile = HTTParty.get( 
            "https://financialmodelingprep.com/api/v3/company/profile/" + 
            symbol.tr( '^|#|+', ''))
          if profile.code == 200 && profile["symbol"]
            profile = profile["profile"]
            moreProfile = HTTParty.get( 
              "https://financialmodelingprep.com/api/v3/search?query=" + 
              symbol.tr( '^|#|+', ''))
            currency = nil
            exchange = nil
            location = nil
            if moreProfile.code == 200 && moreProfile.parsed_response != []
              currency = moreProfile.parsed_response[0]["currency"]
              exchange = moreProfile.parsed_response[0]["exchangeShortName"]
              location = moreProfile.parsed_response[0]["location"]
            end
            StockName.create!( symbol: symbol, companyName: 
              profile["companyName"], exchange: profile["exchange"],
              industry: profile["industry"], website: profile["website"],
              description: profile["description"], ceo: profile["ceo"],
              sector: profile["sector"], image: profile["image"],
              currency: currency, exchangeShortName: exchange, 
              location: location)
            name = StockName.find_by( symbol: symbol)
          else
            puts "New Stock Price: Can't find symbol #{symbol}!"
          end
        end
        if name
          StockPrice.create!( name_id: name.id, price: price["price"], 
            stamp_id: stampId)
        end
      end
    end
    puts "Boot Database => Server returned code #{prices.code}!"
  end

  task sync_names: :environment do
    nameSym = HTTParty.get(
      "https://financialmodelingprep.com/api/v3/company/stock/list")
    if nameSym.code == 200
      knownSym = StockName.select( :symbol).where( 
        symbol: nameSym["symbolsList"].map{ |_| _["symbol"] })
      newEntries = nameSym["symbolsList"].reject do |s| 
        knownSym.map { |_| _["symbol"]}.include? s["symbol"]
      end
      puts "### Sync Names => #{nameSym["symbolsList"].length - 
        newEntries.length} entries ignored."
      puts "### Sync Names => #{newEntries.length} new entries to sync."

      StockName.create( newEntries.map do |e| 
        {companyName: e["name"], symbol: e["symbol"], exchange: e["exchange"]}
      end )
    end
    puts "### Sync Names => Done && Server returned code #{nameSym.code}!"
  end

  task sync_profiles: :environment do
    profiles = StockName.where( 
      "description IS NULL OR image IS NULL")
    puts "### Sync Profiles => #{profiles.length} new entries to sync."
    # API endpoint has 3 tokens per request restriction!
    symbols = profiles.map { |_| _["symbol"]}.each_slice( 3).to_a
    profiles = profiles.each_slice( 3).to_a

    symbols.each_with_index do |chunk, i|
      newProfiles = HTTParty.get( 
        "https://financialmodelingprep.com/api/v3/company/profile/" + 
        chunk.join( ','))
      if newProfiles.code == 200
        newProfiles["companyProfiles"].each_with_index do |profile, j|
          if profile["symbol"] == symbols[i][j]
            data = profile["profile"]
            profiles[i][j].update!( industry: data["industry"], 
              website: data["website"], description: data["description"],
              ceo: data["ceo"], sector: data["sector"], image: data["image"])
          else
            puts "### Sync Profiles => Warning: symbol fetched don't match in database!"
          end
        end
      end
      puts "### Sync Profiles => Server returned code #{newProfiles.code}!"
      puts "### Sync Profiles => #{100 * (i + 1) / symbols.length}%"
    end
    puts "### Sync Profiles => Done!"
  end

  task sync_prices: :environment do
    names = StockName.select( :id, :symbol)
    # 1000 tokens per request so we don't get a 414!
    symbols = names.all.map( &:symbol).each_slice( 1000).to_a
    namesId = names.all.map( &:id).each_slice( 1000).to_a
    symbols.each_with_index do |chunck, i|
      prices = HTTParty.get( "https://financialmodelingprep.com/api/v3/quote/" + 
        chunck.join( ','))
      stampId = StockTime.create!( stamp: DateTime.current()).stamp_id
      if prices.code == 200
        prices.each_with_index do |price, j|
          StockPrice.create( name_id: namesId[i][j], stamp_id: stampId, 
            price: price["price"], change_pct: price["changesPercentage"])
        end
      end
      puts "Sync Prices => Server returned code #{prices.code}!"
      puts "### Sync Profiles => #{100 * (i + 1) / symbols.length}%"
    end
    puts "Sync Prices => Done!"
  end
end
