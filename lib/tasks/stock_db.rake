namespace :stock_db do
  desc "Sync database to new stock data."
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
