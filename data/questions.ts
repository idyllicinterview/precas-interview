export type QuestionCategory =
  | "UK & Study Destination"
  | "University & Course"
  | "University Choice"
  | "Academic Background"
  | "Career Plans"
  | "Finance"
  | "Accommodation & Living"
  | "UKVI & Visa"
  | "Student Life & Support"
  | "Personal & Personality"
  | "Culture & Adaptation"
  | "Creative & Casual";

export type InterviewQuestion = {
  id: number;
  question: string;
  category: QuestionCategory;
  type?: "core" | "random" | "short";
  preparationTime?: 15;
  answerTime?: 30 | 90;
};

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: 1,
    category: "UK & Study Destination",
    question:
      "Why have you decided to study in the UK rather than in your home country or another country?",
  },
  {
    id: 2,
    category: "UK & Study Destination",
    question:
      "What was your main inspiration for choosing the UK as your study destination?",
  },
  {
    id: 3,
    category: "UK & Study Destination",
    question:
      "What other countries did you consider for your studies, and why did you choose the UK?",
  },
  {
    id: 4,
    category: "UK & Study Destination",
    question:
      "What do you think makes studying in the UK different from studying in your home country?",
  },
  {
    id: 5,
    category: "UK & Study Destination",
    question:
      "What do you know about the UK education system?",
  },
  {
    id: 6,
    category: "UK & Study Destination",
    question:
      "What specific experiences or information influenced your decision to study in the UK?",
  },
  {
    id: 7,
    category: "UK & Study Destination",
    question:
      "How do you think studying in the UK will contribute to your personal and professional development?",
  },
  {
    id: 8,
    category: "UK & Study Destination",
    question:
      "Which places in the UK would you like to visit during your free time, and why?",
  },

  {
    id: 9,
    category: "University & Course",
    question:
      "What course have you applied to study, and why have you chosen this course?",
  },
  {
    id: 10,
    category: "University & Course",
    question:
      "Why have you chosen this particular university?",
  },
  {
    id: 11,
    category: "University & Course",
    question:
      "What are the three main reasons that made you choose this university?",
  },
  {
    id: 12,
    category: "University & Course",
    question:
      "What do you know about your university?",
  },
  {
    id: 13,
    category: "University & Course",
    question:
      "How does your university's teaching style align with your preferred way of learning?",
  },
  {
    id: 14,
    category: "University & Course",
    question:
      "What facilities or resources at your university are particularly important to you?",
  },
  {
    id: 15,
    category: "University & Course",
    question:
      "What other UK universities did you research before making your decision?",
  },
  {
    id: 16,
    category: "University & Course",
    question:
      "Why did you choose this university instead of the other universities you considered?",
  },

  {
    id: 17,
    category: "Academic Background",
    question:
      "Please explain your most recent qualification and what you studied.",
  },
  {
    id: 18,
    category: "Academic Background",
    question:
      "How is your previous education related to the course you have applied for?",
  },
  {
    id: 19,
    category: "Academic Background",
    question:
      "Can you describe a significant academic challenge you faced and how you overcame it?",
  },
  {
    id: 20,
    category: "Academic Background",
    question:
      "Can you describe a group project you have worked on and what you learned from it?",
  },
  {
    id: 21,
    category: "Academic Background",
    question:
      "Which subject did you enjoy most during your previous studies, and why?",
  },
  {
    id: 22,
    category: "Academic Background",
    question:
      "Which teacher or lecturer has influenced your academic development the most, and why?",
  },
  {
    id: 23,
    category: "Academic Background",
    question:
      "If you have been away from education for some time, why have you decided to return to full-time study now?",
  },
  {
    id: 24,
    category: "Academic Background",
    question:
      "How have you prepared yourself for returning to full-time education?",
  },

  {
    id: 25,
    category: "Career Plans",
    question:
      "What are your career plans after completing your studies?",
  },
  {
    id: 26,
    category: "Career Plans",
    question:
      "Where do you see yourself five years after completing your course?",
  },
  {
    id: 27,
    category: "Career Plans",
    question:
      "How will this course help you achieve your five-year career plan?",
  },
  {
    id: 28,
    category: "Career Plans",
    question:
      "What skills do you expect to develop during your course?",
  },
  {
    id: 29,
    category: "Career Plans",
    question:
      "How will your UK education benefit your future career?",
  },
  {
    id: 30,
    category: "Career Plans",
    question:
      "Are there any companies or organisations you would like to work for in the future, and why?",
  },
  {
    id: 31,
    category: "Career Plans",
    question:
      "Are there any mentors, role models, or industry leaders who have influenced your career goals?",
  },
  {
    id: 32,
    category: "Career Plans",
    question:
      "Why is this particular qualification important for your future career?",
  },

  {
    id: 33,
    category: "Finance",
    question:
      "How do you plan to finance your studies and living expenses in the UK?",
  },
  {
    id: 34,
    category: "Finance",
    question:
      "Who is financially supporting your education?",
  },
  {
    id: 35,
    category: "Finance",
    question:
      "What financial challenges do you expect during your studies, and how will you manage them?",
  },
  {
    id: 36,
    category: "Finance",
    question:
      "Do you have a contingency plan for unexpected financial emergencies?",
  },
  {
    id: 37,
    category: "Finance",
    question:
      "What research have you done into the cost of living in the UK?",
  },
  {
    id: 38,
    category: "Finance",
    question:
      "How will you manage your monthly budget while studying in the UK?",
  },

  {
    id: 39,
    category: "Accommodation & Living",
    question:
      "What type of accommodation are you planning to live in while studying in the UK?",
  },
  {
    id: 40,
    category: "Accommodation & Living",
    question:
      "Why have you chosen this type of accommodation?",
  },
  {
    id: 41,
    category: "Accommodation & Living",
    question:
      "Did you consider living with roommates or housemates? Why or why not?",
  },
  {
    id: 42,
    category: "Accommodation & Living",
    question:
      "What research have you done about accommodation near your university?",
  },
  {
    id: 43,
    category: "Accommodation & Living",
    question:
      "How will you travel from your accommodation to your university?",
  },
  {
    id: 44,
    category: "Accommodation & Living",
    question:
      "How do you plan to manage your daily responsibilities while living independently?",
  },

  {
    id: 45,
    category: "UKVI & Visa",
    question:
      "How familiar are you with the rules and regulations of the UK Student visa?",
  },
  {
    id: 46,
    category: "UKVI & Visa",
    question:
      "What do you know about the working restrictions on a UK Student visa?",
  },
  {
    id: 47,
    category: "UKVI & Visa",
    question:
      "What could happen if you breach the working conditions of your Student visa?",
  },
  {
    id: 48,
    category: "UKVI & Visa",
    question:
      "How will you make sure that you comply with UK immigration requirements?",
  },
  {
    id: 49,
    category: "UKVI & Visa",
    question:
      "How do you plan to stay informed about changes to UK immigration rules?",
  },
  {
    id: 50,
    category: "UKVI & Visa",
    question:
      "What are your main responsibilities as an international student in the UK?",
  },

  {
    id: 51,
    category: "Student Life & Support",
    question:
      "What are your expectations of student support services at your university?",
  },
  {
    id: 52,
    category: "Student Life & Support",
    question:
      "What kind of academic support might you use if you face difficulties with your studies?",
  },
  {
    id: 53,
    category: "Student Life & Support",
    question:
      "How will you maintain a healthy balance between studying and your personal life?",
  },
  {
    id: 54,
    category: "Student Life & Support",
    question:
      "How do you plan to maintain a healthy lifestyle while studying in the UK?",
  },
  {
    id: 55,
    category: "Student Life & Support",
    question:
      "How do you think meeting students from different countries will benefit you?",
  },
  {
    id: 56,
    category: "Student Life & Support",
    question:
      "How did you gather feedback or information from current students or alumni before choosing your university?",
  },

  {
    id: 57,
    category: "Personal & Personality",
    question:
      "How would you describe yourself?",
  },
  {
    id: 58,
    category: "Personal & Personality",
    question:
      "What does success mean to you?",
  },
  {
    id: 59,
    category: "Personal & Personality",
    question:
      "What is the best piece of advice you have ever received?",
  },
  {
    id: 60,
    category: "Personal & Personality",
    question:
      "What qualities do you value most in the people you spend time with?",
  },
  {
    id: 61,
    category: "Personal & Personality",
    question:
      "What is something you have achieved that makes you proud?",
  },
  {
    id: 62,
    category: "Personal & Personality",
    question:
      "What is something you have done that made you extremely happy?",
  },
  {
    id: 63,
    category: "Personal & Personality",
    question:
      "What is one personal quality you would like to improve?",
  },
  {
    id: 64,
    category: "Personal & Personality",
    question:
      "How do you normally deal with pressure or stressful situations?",
  },

  {
    id: 65,
    category: "Culture & Adaptation",
    question:
      "How do you think studying in the UK will influence your global perspective?",
  },
  {
    id: 66,
    category: "Culture & Adaptation",
    question:
      "Can you describe a time when you had to adapt to a new environment or culture?",
  },
  {
    id: 67,
    category: "Culture & Adaptation",
    question:
      "How will you overcome language or communication challenges in the UK?",
  },
  {
    id: 68,
    category: "Culture & Adaptation",
    question:
      "How would you work effectively with people from different cultural backgrounds?",
  },
  {
    id: 69,
    category: "Culture & Adaptation",
    question:
      "What do you think will be the biggest adjustment when moving to the UK?",
  },
  {
    id: 70,
    category: "Culture & Adaptation",
    question:
      "How do you think your international experience could benefit your future career?",
  },

  {
    id: 71,
    category: "Creative & Casual",
    question:
      "If you could instantly become an expert in anything, what would it be and why?",
  },
  {
    id: 72,
    category: "Creative & Casual",
    question:
      "What country would you love to visit and why?",
  },
  {
    id: 73,
    category: "Creative & Casual",
    question:
      "What does your ideal day look like?",
  },
  {
    id: 74,
    category: "Creative & Casual",
    question:
      "What is your favourite season and why?",
  },
  {
    id: 75,
    category: "Creative & Casual",
    question:
      "What is the best book, film, or TV series you have experienced and why?",
  },
  {
    id: 76,
    category: "Creative & Casual",
    question:
      "If you could have dinner with any inspiring person, living or historical, who would it be and why?",
  },
  {
    id: 77,
    category: "Creative & Casual",
    question:
      "If you had to start a business, what kind of business would you create?",
  },
  {
    id: 78,
    category: "Creative & Casual",
    question:
      "If you could learn one new skill instantly, what would you choose?",
  },
  {
    id: 79,
    category: "Creative & Casual",
    question:
      "What is one experience that has changed the way you see the world?",
  },
  {
    id: 80,
    category: "Creative & Casual",
    question:
      "If you could spend one perfect day anywhere in the world, where would you spend it and what would you do?",
  },
];

/**
 * Randomly shuffles an array using Fisher-Yates.
 */
function shuffleQuestions(
  questions: InterviewQuestion[]
): InterviewQuestion[] {
  const shuffled = [...questions];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Returns 16 random questions for one mock interview.
 *
 * There are 80 questions total.
 * Each interview receives a different random set of 16.
 */

/**
 * Short-answer questions.
 * These questions have a 30-second answer limit.
 */
export const shortInterviewQuestions: InterviewQuestion[] = [
  {
    id: 85,
    category: "UK & Study Destination",
    question: "Have you visited the UK before?",
    type: "short",
    preparationTime: 15,
    answerTime: 30,
  },
  {
    id: 86,
    category: "UK & Study Destination",
    question: "Have you considered studying in any other country?",
    type: "short",
    preparationTime: 15,
    answerTime: 30,
  },
  {
    id: 87,
    category: "University & Course",
    question: "Have you researched your university before applying?",
    type: "short",
    preparationTime: 15,
    answerTime: 30,
  },
  {
    id: 88,
    category: "Accommodation & Living",
    question: "Have you researched accommodation near your university?",
    type: "short",
    preparationTime: 15,
    answerTime: 30,
  },
  {
    id: 89,
    category: "Accommodation & Living",
    question: "Do you plan to live alone or with other students?",
    type: "short",
    preparationTime: 15,
    answerTime: 30,
  },
  {
    id: 90,
    category: "UKVI & Visa",
    question: "Do you understand the basic conditions of your UK Student visa?",
    type: "short",
    preparationTime: 15,
    answerTime: 30,
  },
  {
    id: 91,
    category: "Career Plans",
    question: "Do you plan to work after completing your studies?",
    type: "short",
    preparationTime: 15,
    answerTime: 30,
  },
  {
    id: 92,
    category: "Student Life & Support",
    question: "Do you plan to join any university clubs or societies?",
    type: "short",
    preparationTime: 15,
    answerTime: 30,
  },
];
export const coreInterviewQuestions: InterviewQuestion[] = [
  {
    id: 81,
    category: "Student Life & Support",
    question:
      "What are your expectations of the UK's student support services and resources?",
    type: "core",
    preparationTime: 15,
    answerTime: 90,
  },
  {
    id: 82,
    category: "Accommodation & Living",
    question:
      "What type of accommodation are you planning to live in while studying at the university?",
    type: "core",
    preparationTime: 15,
    answerTime: 90,
  },
  {
    id: 83,
    category: "UKVI & Visa",
    question:
      "Have you ever received a visa refusal? If so, please explain why you were refused, when this occurred, the country you applied to, and the type of visa applied for.",
    type: "core",
    preparationTime: 15,
    answerTime: 90,
  },
  {
    id: 84,
    category: "University Choice",
    question: "Why did you decide to study at this university?",
    type: "core",
    preparationTime: 15,
    answerTime: 90,
  },
];

export function getRandomInterviewQuestions(
  count: number = 16,
  excludedIds: number[] = []
): InterviewQuestion[] {
  // Keep only core questions that are not excluded.
  const coreQuestions = coreInterviewQuestions.filter(
    (question) => !excludedIds.includes(question.id)
  );

  // Keep only short-answer questions that are not excluded.
  const availableShortQuestions = shortInterviewQuestions.filter(
    (question) => !excludedIds.includes(question.id)
  );

  // Keep only normal questions that are not excluded.
  const availableNormalQuestions = interviewQuestions.filter(
    (question) => !excludedIds.includes(question.id)
  );

  // Select 4 short-answer questions with a 30-second answer limit.
  const shortCount = Math.min(4, availableShortQuestions.length);

  const selectedShortQuestions = shuffleQuestions(
    availableShortQuestions
  ).slice(0, shortCount);

  // Fill the remaining places with normal 90-second questions.
  const normalCount = Math.max(
    0,
    count - coreQuestions.length - selectedShortQuestions.length
  );

  const selectedNormalQuestions = shuffleQuestions(
    availableNormalQuestions
  ).slice(0, normalCount);

  // Combine and randomise the final interview.
  return shuffleQuestions([
    ...coreQuestions,
    ...selectedShortQuestions,
    ...selectedNormalQuestions,
  ]).slice(0, count);
}
export function getPersonalizedInterviewQuestions(
  university: string,
  course: string,
  intake: string,
  count: number = 4
): InterviewQuestion[] {
  const universityName = university.trim();
  const courseName = course.trim();
  const intakeName = intake.trim();

  const personalizedQuestions: InterviewQuestion[] = [
    {
      id: 1001,
      category: "University & Course",
      question: universityName
        ? `Why did you choose ${universityName} for your studies?`
        : "Why have you chosen your intended university?",
      type: "random",
      preparationTime: 15,
      answerTime: 90,
    },
    {
      id: 1002,
      category: "University & Course",
      question:
        universityName && courseName
          ? `What specifically attracted you to the ${courseName} course at ${universityName}?`
          : courseName
            ? `What specifically attracted you to the ${courseName} course?`
            : universityName
              ? `What specifically attracted you to ${universityName}?`
              : "What specifically attracted you to your chosen course and university?",
      type: "random",
      preparationTime: 15,
      answerTime: 90,
    },
    {
      id: 1003,
      category: "University & Course",
      question:
        universityName && courseName
          ? `How does studying ${courseName} at ${universityName} fit into your academic and career plans?`
          : courseName
            ? `How does studying ${courseName} fit into your academic and career plans?`
            : universityName
              ? `How does studying at ${universityName} fit into your academic and career plans?`
              : "How does your chosen course fit into your academic and career plans?",
      type: "random",
      preparationTime: 15,
      answerTime: 90,
    },
    {
      id: 1004,
      category: "University & Course",
      question:
        intakeName && universityName
          ? `Why have you chosen the ${intakeName} intake for your studies at ${universityName}?`
          : intakeName
            ? `Why have you chosen the ${intakeName} intake for your studies?`
            : universityName
              ? `Why have you chosen your intended intake for studies at ${universityName}?`
              : "Why have you chosen your intended intake for your studies?",
      type: "random",
      preparationTime: 15,
      answerTime: 90,
    },
  ];

  return shuffleQuestions(personalizedQuestions).slice(0, count);
}



