
#include <boost/unordered_map.hpp>
#include <functional>
#include <boost/unordered_map.hpp>
#include "document.hpp"

#ifndef DOCHANDLER_HPP
#define DOCHANDLER_HPP

namespace handler {

  typedef std::function<bool( std::pair<int, doc::Document*>, 
    std::pair<int, doc::Document*>)> Compare;
  typedef boost::unordered_map<std::string, doc::Word*> WordMap;
  typedef std::set<std::pair<int, doc::Document*>, Compare> OrderedMatch;


  class DocBag {
    
    public:
      static WordMap wordMap;
      static std::map<int, doc::Document*> documents;
      static doc::Document* target;
      static Compare scoreComp;

      static void insertWord( std::string word, std::vector<doc::Word*>* words);

      static int readDocuments( std::ifstream &docsFile);

      static OrderedMatch matchDocument( std::string targetDoc);

      static void clearMatch();
  };
};

#endif