function createCreatePollResponse(pollAnswersRepository) {
  return function createPollResponse(poll) {
    return pollAnswersRepository.insert(poll);
  };
}

module.exports = createCreatePollResponse;