namespace :documentMatch do
  desc "Boot Document matcher - i.e. process to recieve client queries."
  task :boot, [:docFile, :searchLimit] => [:environment] do |t,args|

    begin
      docMatcher = IO.popen("./bin/documentMatch #{args[:docFile]} #{
        args[:searchLimit]}", "r+")
      puts "Document match boot: Document matcher is up!"
      Api::V1::SearchController.docMatcher = docMatcher
    rescue Exception => e
      puts "Could not boot documentMatcher!"
      puts e
    end
  end
end