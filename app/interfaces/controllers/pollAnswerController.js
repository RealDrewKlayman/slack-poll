const config = require('../../config');
const createCreatePollResponse = require('../../application/useCase/createPollResponse');
const createFetchPoll = require('../../application/useCase/fetchPoll');
const createFetchPollResponses = require('../../application/useCase/fetchPollResponses');
const pollsMessageSerializerSlack = require('../serializers/pollsMessageSerializerSlack');

// Build poll answers controller
function createPollAnswerController({
  pollAnswersRepository,
  pollsRepository,
}) {
  const createPollResponse = createCreatePollResponse(pollAnswersRepository);
  const fetchPoll = createFetchPoll(pollsRepository);
  const fetchPollResponses = createFetchPollResponses(pollAnswersRepository);

  const postPollAnswer = createPostPollAnswer({
    fetchPoll,
    fetchPollResponses,
    createPollResponse,
  });

  return { postPollAnswer };
}

// POST /hook
function createPostPollAnswer({
  fetchPoll,
  fetchPollResponses,
  createPollResponse,
}) {
  async function postPollAnswer(req, res) {
    // Slack interactive action request body
    // https://api.slack.com/reference/interaction-payloads/actions
    const { token, user, callback_id, actions } = JSON.parse(req.body.payload);
    const [action] = actions;

    // Validate verification token
    if (config.SLACK_VERIFICATION_TOKEN !== token)
      return res.status(401).send();

    try {
      const currentPoll = await fetchPoll({ id: callback_id });

      await createPollResponse(currentPoll, {
        poll: currentPoll.id,
        option: action.value,
        owner: user.id,
      });

      const pollResponses = await fetchPollResponses({ id: callback_id });
      return res
        .status(201)
        .json(
          pollsMessageSerializerSlack(currentPoll, { responses: pollResponses })
        );
    } catch (err) {
      return res.status(500).json({
        text: "Sorry, there's been an error. Try again later.",
        replace_original: false,
      });
    }
  }

  return postPollAnswer;
}

module.exports = createPollAnswerController;
