namespace :dumpProfiles do
  desc "Dump companies profiles to text (for searching program)"
  task :dumpAll, [:filename] => [:environment] do |t,args|
    profile = StockName.select( :id, :companyName, :symbol, :location, 
      :exchange, :industry, :sector, :ceo, :exchangeShortName, :description
      ).all
    open( args[:filename], 'w') do |file|
      profile.each do |record|
        document = record.attributes.map do |k,v| 
          v.to_s.gsub( /[^0-9a-z ]/i, '').downcase if v && v != ""
        end
        file << document.join( ' ') << "\n" 
      end
    end
  end
end