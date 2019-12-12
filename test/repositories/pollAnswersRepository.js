function createPollAnswersRepository(sequelize) {
  const { models } = sequelize;

  async function _find(pollAnswerData = {}) {
    const pollAnswerRecords = await models.pollAnswer.findAll({
      where: pollAnswerRecordInputSerializer(pollAnswerData),
    });

    const pollAnswer = pollAnswerRecords.map(pollAnswerRecordOutupSerializer);
    return pollAnswer;
  }

  async function _insert(pollData) {
    const pollAnswerRecord = await models.pollAnswer.create(
      pollAnswerRecordInputSerializer(pollData)
    );

    return pollAnswerRecordOutupSerializer(pollAnswerRecord);
  }

  async function _update(pollAnswerData) {
    const { id, ...pollUpdate } = pollAnswerRecordInputSerializer(
      pollAnswerData
    );

    await models.pollAnswer.update(pollUpdate, { where: { id } });
    const record = await models.pollAnswer.findOne({ where: { id } });
    return pollAnswerRecordInputSerializer(record);
  }

  return {
    find: jest.fn(_find),
    insert: jest.fn(_insert),
    update: jest.fn(_update),
  };
}

function pollAnswerRecordOutupSerializer(pollAnswerRecord) {
  const { pollId, ...plainPollAnswerRecord } = pollAnswerRecord.toJSON();
  if (pollId) plainPollAnswerRecord.poll = pollId;
  return plainPollAnswerRecord;
}

function pollAnswerRecordInputSerializer({ poll, ...pollAnswer }) {
  const plainPollRecord = pollAnswer;
  if (poll) plainPollRecord.pollId = poll;
  return plainPollRecord;
}

module.exports = createPollAnswersRepository;