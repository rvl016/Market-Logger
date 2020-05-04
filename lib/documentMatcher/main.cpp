#include <fstream>
#include <iostream>
#include "docHandler.hpp"
#include "consts.h"

int main( int argc, const char* argv[]) {

  handler::DocBag docsRef;
  std::string targDocument;
  handler::OrderedMatch orderedMatch;
  std::ifstream filename;
  int matchesLimit;

  if (argc != 3) {
    std::cout << argv[0] << " 'filename' 'matches limit'" 
      << std::endl;
    return 127;
  }
  try {
    matchesLimit = std::stoi( argv[2]);
  }
  catch( ...) {
    std::cout << "Match limit is not an integer" << std::endl;
    return 1;
  }

  filename.open( argv[1], std::ios::in);

  if (docsRef.readDocuments( filename))
    return 1;

  #if DEBUG
    std::cout << "Ready!" << std::endl;
  #endif

  while (true) {
    int cnt = 0;
    
    std::getline( std::cin, targDocument);
    orderedMatch = docsRef.matchDocument( targDocument);
    
    for (auto const& pair: orderedMatch) {
      if (cnt == matchesLimit || pair.second->score == .0f)
        break;
      #if DEBUG
        std::cout << pair.first << " " << pair.second->score << std::endl;
      #else
        std::cout << pair.first << " ";
      #endif
      cnt++;
    }
    std::cout << std::endl << std::flush;
    orderedMatch.clear();
  }
  return 0;
}
