#include <vector>
#include <boost/unordered_map.hpp>

#ifndef DOCUMENT_HPP
#define DOCUMENT_HPP

namespace doc {

  class Word {

    private:
      static int maxId;
      
    public:
      int id;
      std::string word;

      static void idInit();

      Word( std::string word); 
      ~Word();

      bool operator==( Word* other);
  };

  typedef boost::unordered_map<int, int> intMap;

  class Document {

    public:
      std::vector<Word*> words;
      intMap countMap;
      float documentNorm;
      float score;

      Document( std::vector<Word*>* words);
      ~Document();

      void getScore( Document* other);

  };
};  

#endif
