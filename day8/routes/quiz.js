const router = require("express").Router();

let quiz = [
  {
    id: 1,
    type: "short_answer",
    question: "Why is the sky blue?",
    answers: [],
    correct_answer: 0,
  },
  {
    id: 2,
    type: "multiple_choice",
    question: "Why is the sky blue?",
    answers: [
      { id: 1, answer: "Because of physics" },
      { id: 2, answer: "Because that the way it always was" },
      { id: 3, answer: "I don't know" },
    ],
    correct_answer: 1,
  },
  {
    id: 3,
    type: "multiple_selection_choice",
    question: "Why is the sky blue?",
    answers: [
      { id: 1, answer: "Because of physics" },
      { id: 2, answer: "Because that the way it always was" },
      { id: 3, answer: "I don't know" },
    ],
    correct_answer: 1,
  },
  {
    id: 4,
    type: "long_text",
    question: "Why is the sky blue?",
    answers: [],
    correct_answer: 0,
  },
  {
    id: 5,
    type: "description",
    question: "random text to show to the user",
    answers: [],
    correct_answer: 0,
  },
  {
    id: 6,
    type: "true_false",
    question: "Is the sky blue",
    answers: [],
    correct_answer: 2,
  },
];

router.get("/quiz", (req, res) => {
  try {
    res.json(quiz);
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error?.message,
    });
  }
});

module.exports = router;
