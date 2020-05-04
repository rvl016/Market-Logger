#include <iostream>
#include "document.hpp"
#include <boost/unordered_map.hpp>
#include <vector>
#include <cmath>
#if DEBUG
  #include <iostream>
#endif

using namespace doc;

int Word::maxId;

void Word::idInit() {
  maxId = 0;
}

Word::Word( std::string word) {
  this->id = maxId;
  maxId++;
  this->word = word;
}

Word::~Word() {
  delete this;
}

bool Word::operator==( Word* other) {
  return this->id == other->id;
}

Document::Document( std::vector<Word*>* words) {
  this->words = *words;
  this->score = .0f;
  this->documentNorm = .0f;

 
  for (auto const& word: this->words) {
    this->countMap[word->id] = this->countMap.count( word->id) == 0 ? 
      1 : this->countMap[word->id] + 1;
  }

  for (auto const& pair: this->countMap) {
    this->documentNorm += pair.second ^ 2;
  }
  this->documentNorm = sqrt( this->documentNorm);
}



Document::~Document() {
  this->words.clear();
  delete this;
}

void Document::getScore( Document* other) {
  float partialScore = .0f;
  float score;
  if (this->documentNorm == .0f || other->documentNorm == .0f)
    return;
  for (auto const& pair: this->countMap) {
    int count = other->countMap.count( pair.first);
    partialScore += pair.second * count;
  }
  this->score = partialScore / this->documentNorm / other->documentNorm;
}
