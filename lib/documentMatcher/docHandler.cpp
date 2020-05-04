#include <fstream>
#include <functional>
#include <map>
#include <set>
#include <algorithm>
#include <boost/algorithm/string.hpp>
#include <boost/unordered_map.hpp>
#include "document.hpp"
#include "docHandler.hpp"
#include "consts.h"
#if DEBUG
  #include <iostream>
#endif

using namespace handler;

WordMap DocBag::wordMap;
std::map<int, doc::Document*> DocBag::documents;
doc::Document* DocBag::target;

Compare DocBag::scoreComp = []( std::pair<int,doc::Document*> docA, 
  std::pair<int,doc::Document*> docB) {
  if (docA.second->score == docB.second->score)
    return docA.first < docB.first;
  return docA.second->score > docB.second->score;
};

void DocBag::insertWord( std::string word, std::vector<doc::Word*>* words) {
  if (! wordMap.count( word))
    wordMap[word] = new doc::Word( word);
  words->push_back( wordMap[word]);
};

int DocBag::readDocuments( std::ifstream &docsFile) {
  std::vector<std::string> tokens;
  std::string line;
  std::vector<doc::Word*>* words;

  while (getline( docsFile, line)) {
    words = new std::vector<doc::Word*>;
    boost::split( tokens, line, boost::is_any_of( " "));
    int docId;
    try {
      docId = std::stoi( tokens[0]);
    }
    catch( ...) {
      return STOICONVERTION;
    }

    for (int i = 1; i < tokens.size(); i++) 
      if (tokens[i] != "")
        insertWord( tokens[i], words);

    documents[docId] = new doc::Document( words);
    tokens.clear();
  }
  return 0;
} 

OrderedMatch DocBag::matchDocument( 
  std::string targetDoc) {

  std::vector<std::string> tokens;
  std::vector<doc::Word*>* words = new std::vector<doc::Word*>;
  boost::split( tokens, targetDoc, boost::is_any_of( " "));

  for (auto const token: tokens) 
    if (token != "")
      insertWord( token, words);

  target = new doc::Document( words);

  for (auto& document: documents) 
    document.second->getScore( target);

  OrderedMatch orderedMatch( documents.begin(), documents.end(), 
    scoreComp);
  tokens.clear();
  return orderedMatch;
}

void DocBag::clearMatch() {
  delete target;
}
