"use client";

import { useEffect, useRef, useState } from "react";
import { getRandomInterviewQuestions } from "@/data/questions";
import {
  saveInterviewAnswer,
  saveInterviewSession,
  clearSavedInterviewAnswers,
} from "@/app/interview/lib/interviewStorage";

type Question = {
  question: string;
  category?: string;
};

type QuestionStatus = "unanswered" | "answered" | "skipped";

export default function InterviewStartPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [interviewQuestions, setInterviewQuestions] = useState<Question[]>([]);
  const [questionStatus, setQuestionStatus] = useState<QuestionStatus[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [cameraReady, setCameraReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(90);

  const [recordedVideos, setRecordedVideos] = useState<
    Record<number, string>
  >({});

  const [testAnswerRecorded, setTestAnswerRecorded] = useState<
    Record<number, boolean>
  >({});

  const [error, setError] = useState("");
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [savingAnswer, setSavingAnswer] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const [interviewStartedAt, setInterviewStartedAt] = useState<string | null>(
    null
  );

  const [fullName, setFullName] = useState("");
  const [university, setUniversity] = useState("");
  const [course, setCourse] = useState("");
  const [intake, setIntake] = useState("");

  const [interviewId] = useState(
    () =>
      "PRECAS-" +
      new Date().getFullYear() +
      "-" +
      Math.random().toString(36).substring(2, 8).toUpperCase()
  );

  /*
   * LOAD QUESTIONS
   */
  useEffect(() => {
    const questions = getRandomInterviewQuestions();

    setInterviewQuestions(questions);
    setQuestionStatus(questions.map(() => "unanswered"));
  }, []);

  /*
   * TIMER
   */
  useEffect(() => {
    if (!recording) {
      return;
    }

    if (seconds <= 0) {
      stopAnswer();
      return;
    }

    const timer = window.setTimeout(() => {
      setSeconds((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [recording, seconds]);

  /*
   * CLEANUP
   */
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      Object.values(recordedVideos).forEach((videoUrl) => {
        URL.revokeObjectURL(videoUrl);
      });
    };
  }, [recordedVideos]);

  /*
   * CLEAR CURRENT RECORDING
   */
  const clearCurrentRecording = () => {
    setRecordedVideos((previous) => {
      const updated = { ...previous };

      if (updated[currentQuestion]) {
        URL.revokeObjectURL(updated[currentQuestion]);
        delete updated[currentQuestion];
      }

      return updated;
    });

    setTestAnswerRecorded((previous) => {
      const updated = { ...previous };
      delete updated[currentQuestion];
      return updated;
    });
  };

  /*
   * CAMERA
   */
  const startCamera = async () => {
    try {
      setError("");

      if (!navigator.mediaDevices) {
        setError("Camera access is not supported by this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraReady(true);
    } catch (cameraError) {
      console.error(cameraError);

      setError(
        "Camera or microphone access was denied. Testing Mode is available below."
      );
    }
  };

  /*
   * START INTERVIEW
   */
  const startInterview = async () => {
    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name before starting the interview.");
      return;
    }

    if (!university.trim()) {
      setError("Please enter your university before starting the interview.");
      return;
    }

    if (!course.trim()) {
      setError("Please enter your course before starting the interview.");
      return;
    }

    if (!intake.trim()) {
      setError("Please enter your intake before starting the interview.");
      return;
    }

    if (!cameraReady) {
      setInterviewStartedAt(new Date().toISOString());
    setInterviewStarted(true);
      return;
    }

    setInterviewStartedAt(new Date().toISOString());
    setInterviewStarted(true);
  };

  /*
   * REAL RECORDING
   */
  const startRealRecording = () => {
    if (!streamRef.current) {
      setError("Please enable the camera and microphone first.");
      return;
    }

    try {
      setError("");
      clearCurrentRecording();
      chunksRef.current = [];

      const recorder = new MediaRecorder(streamRef.current);

      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "video/webm",
        });

        const videoUrl = URL.createObjectURL(blob);

        setRecordedVideos((previous) => ({
          ...previous,
          [currentQuestion]: videoUrl,
        }));

        setQuestionStatus((previous) => {
          const updated = [...previous];
          updated[currentQuestion] = "answered";
          return updated;
        });
      };

      recorder.start();

      setSeconds(90);
      setRecording(true);
    } catch (recordingError) {
      console.error(recordingError);

      setError("Unable to start recording on this browser.");
    }
  };

  /*
   * TESTING MODE RECORDING
   */
  const startTestAnswer = () => {
    setError("");
    clearCurrentRecording();

    setSeconds(90);
    setRecording(true);
  };

  /*
   * STOP ANSWER
   */
  const stopAnswer = async () => {
    if (!recording) {
      return;
    }

    if (
      recorderRef.current &&
      recorderRef.current.state !== "inactive"
    ) {
      recorderRef.current.stop();
    }

    setRecording(false);

    if (!cameraReady) {
      setTestAnswerRecorded((previous) => ({
        ...previous,
        [currentQuestion]: true,
      }));
    }

    setQuestionStatus((previous) => {
      const updated = [...previous];
      updated[currentQuestion] = "answered";
      return updated;
    });

    const question = interviewQuestions[currentQuestion];

    if (question) {
      try {
        setSavingAnswer(true);

        await saveInterviewAnswer({
          interviewId,
          questionIndex: currentQuestion,
          question: question.question,
          category: question.category,
          status: "answered",
          recordedAt: new Date().toISOString(),
          duration: 90 - seconds,
        });
      } catch (saveError) {
        console.error("Unable to save interview answer:", saveError);
      } finally {
        setSavingAnswer(false);
      }
    }
  };

  /*
   * NEXT QUESTION
   */
  const moveToNextQuestion = async () => {
    if (recording || savingAnswer) {
      return;
    }

    setSeconds(90);

    if (currentQuestion < interviewQuestions.length - 1) {
      setCurrentQuestion((value) => value + 1);
    } else {
      setInterviewComplete(true);
    }
  };

  /*
   * PREVIOUS QUESTION
   */
  const moveToPreviousQuestion = () => {
    if (recording) {
      return;
    }

    setSeconds(90);

    if (currentQuestion > 0) {
      setCurrentQuestion((value) => value - 1);
    }
  };

  /*
   * SKIP QUESTION
   */
  const skipQuestion = async () => {
    if (recording) {
      return;
    }

    const question = interviewQuestions[currentQuestion];

    if (question) {
      try {
        await saveInterviewAnswer({
          interviewId,
          questionIndex: currentQuestion,
          question: question.question,
          category: question.category,
          status: "skipped",
          recordedAt: new Date().toISOString(),
          duration: 0,
        });
      } catch (saveError) {
        console.error("Unable to save skipped question:", saveError);
      }
    }

    clearCurrentRecording();

    setQuestionStatus((previous) => {
      const updated = [...previous];
      updated[currentQuestion] = "skipped";
      return updated;
    });

    setSeconds(90);

    if (currentQuestion < interviewQuestions.length - 1) {
      setCurrentQuestion((value) => value + 1);
    } else {
      setInterviewComplete(true);
    }
  };

  /*
   * RESTART
   */
  const restartInterview = async () => {
    try {
      await clearSavedInterviewAnswers();
    } catch (clearError) {
      console.error(
        "Unable to clear previous interview answers:",
        clearError
      );
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    streamRef.current = null;

    Object.values(recordedVideos).forEach((videoUrl) => {
      URL.revokeObjectURL(videoUrl);
    });

    const questions = getRandomInterviewQuestions();

    setInterviewQuestions(questions);
    setQuestionStatus(questions.map(() => "unanswered"));
    setCurrentQuestion(0);
    setCameraReady(false);
    setRecording(false);
    setSeconds(90);
    setRecordedVideos({});
    setTestAnswerRecorded({});
    setError("");
    setInterviewComplete(false);
    setInterviewStarted(false);
  };

  /*
   * COUNTS
   */
  const answeredCount = questionStatus.filter(
    (status) => status === "answered"
  ).length;

  const skippedCount = questionStatus.filter(
    (status) => status === "skipped"
  ).length;

  const unansweredCount = questionStatus.filter(
    (status) => status === "unanswered"
  ).length;

  const completionPercentage =
    interviewQuestions.length > 0
      ? Math.round(
          (answeredCount / interviewQuestions.length) * 100
        )
      : 0;

  /*
   * LOADING
   */
  if (!interviewQuestions.length && !interviewComplete) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] text-white">
        <div className="text-center">
          <img
            src="/idyllic-logo.png"
            alt="Idyllic"
            className="mx-auto mb-8 h-12 w-auto max-w-[220px] object-contain"
          />

          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

          <p className="font-semibold">
            Preparing your interview...
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Please wait a moment.
          </p>
        </div>
      </main>
    );
  }

  /*
   * PRE-INTERVIEW
   */
  if (!interviewStarted && !interviewComplete) {
    return (
      <main className="min-h-screen bg-[#07111f] text-white">
        <header className="border-b border-white/10 bg-[#081526]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <img
              src="/idyllic-logo.png"
              alt="Idyllic"
              className="h-10 w-auto max-w-[200px] object-contain"
            />

            <div className="rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-300">
              Pre-CAS Mock Interview
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">

            <div className="rounded-[2rem] border border-white/10 bg-[#0d1b2d] p-8 shadow-2xl sm:p-10">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                Pre-CAS Preparation
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Prepare for your
                <span className="block text-blue-400">
                  university interview.
                </span>
              </h1>

              <p className="mt-6 text-base leading-7 text-slate-400">
                This mock interview is designed to help you
                practise answering university-style questions
                naturally and confidently before your actual
                Pre-CAS interview.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">

                <div className="rounded-2xl border border-white/5 bg-[#13243a] p-5">
                  <div className="text-2xl">
                    🎥
                  </div>

                  <p className="mt-3 font-semibold">
                    Camera & microphone
                  </p>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    Camera and microphone recording are available
                    when your device supports them.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-[#13243a] p-5">
                  <div className="text-2xl">
                    ⏱
                  </div>

                  <p className="mt-3 font-semibold">
                    90 seconds per answer
                  </p>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    Take a moment to think, then answer naturally
                    within the time limit.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-[#13243a] p-5">
                  <div className="text-2xl">
                    ❓
                  </div>

                  <p className="mt-3 font-semibold">
                    {interviewQuestions.length} questions
                  </p>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    Your interview contains a randomly selected
                    set of questions.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-[#13243a] p-5">
                  <div className="text-2xl">
                    🔄
                  </div>

                  <p className="mt-3 font-semibold">
                    Review & re-record
                  </p>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    Review your answer and record it again before
                    continuing.
                  </p>
                </div>

              </div>

              <div className="mt-8 rounded-2xl border border-blue-400/10 bg-blue-500/5 p-5">

                <p className="text-sm font-semibold text-blue-300">
                  Before you begin
                </p>

                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-400">
                  <li>• Find a quiet and well-lit place.</li>
                  <li>• Keep your face clearly visible on camera.</li>
                  <li>• Answer in your own words rather than memorising a script.</li>
                  <li>• Speak clearly and maintain eye contact with the camera.</li>
                </ul>

              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-[#101f33] p-6">

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-400">
                  Candidate Information
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  Enter your details before starting the mock interview.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Full Name
                    </label>

                    <input
                      value={fullName}
                      onChange={(event) =>
                        setFullName(event.target.value)
                      }
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-white/10 bg-[#0b1829] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      University
                    </label>

                    <input
                      value={university}
                      onChange={(event) =>
                        setUniversity(event.target.value)
                      }
                      placeholder="Enter your university"
                      className="w-full rounded-xl border border-white/10 bg-[#0b1829] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Course
                    </label>

                    <input
                      value={course}
                      onChange={(event) =>
                        setCourse(event.target.value)
                      }
                      placeholder="Enter your course"
                      className="w-full rounded-xl border border-white/10 bg-[#0b1829] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Intake
                    </label>

                    <input
                      value={intake}
                      onChange={(event) =>
                        setIntake(event.target.value)
                      }
                      placeholder="e.g. November 2026"
                      className="w-full rounded-xl border border-white/10 bg-[#0b1829] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />
                  </div>

                </div>

                <p className="mt-4 text-xs text-slate-500">
                  Your information will be associated with this mock interview.
                </p>

                <p className="mt-2 text-xs font-semibold text-blue-400">
                  Interview ID: {interviewId}
                </p>

              </div>

              {error && (
                <div className="mt-6 rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-sm leading-6 text-red-300">
                  {error}
                </div>
              )}

              <button
                onClick={startInterview}
                className="mt-8 w-full rounded-xl bg-blue-600 px-8 py-4 font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
              >
                Start Interview
              </button>

            </div>

            <div className="flex flex-col gap-5">

              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl">

                <div className="relative aspect-video">

                  {cameraReady ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0c1b2e] to-[#07111f]">

                      <div className="px-6 text-center">

                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-400/10 bg-blue-500/5 text-3xl">
                          🎥
                        </div>

                        <p className="font-semibold">
                          Camera preview
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          Camera is optional in Testing Mode.
                        </p>

                      </div>

                    </div>
                  )}

                </div>

              </div>

              <div className="rounded-[2rem] border border-white/10 bg-[#0d1b2d] p-6">

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Interview format
                </p>

                <div className="mt-5 space-y-4">

                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-sm text-slate-400">
                      Questions
                    </span>

                    <span className="font-semibold">
                      {interviewQuestions.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-sm text-slate-400">
                      Time per answer
                    </span>

                    <span className="font-semibold">
                      90 seconds
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">
                      Recording
                    </span>

                    <span className="font-semibold text-green-400">
                      {cameraReady
                        ? "Video + Audio"
                        : "Testing Mode"}
                    </span>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>
      </main>
    );
  }

  /*
   * COMPLETE SCREEN
   */
  if (interviewComplete) {
    return (
      <main className="min-h-screen bg-[#07111f] text-white">

        <header className="border-b border-white/10 bg-[#081526]">

          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

            <img
              src="/idyllic-logo.png"
              alt="Idyllic"
              className="h-10 w-auto max-w-[200px] object-contain"
            />

            <div className="rounded-full border border-green-400/20 bg-green-500/10 px-4 py-2 text-xs font-semibold text-green-300">
              Interview Complete
            </div>

          </div>

        </header>

        <section className="mx-auto max-w-5xl px-6 py-10">

          <div className="rounded-[2rem] border border-white/10 bg-[#0d1b2d] p-8 shadow-2xl sm:p-10">

            <div className="text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-4xl text-green-400">
                ✓
              </div>

              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                Pre-CAS Mock Interview
              </p>

              <h1 className="mt-3 text-3xl font-bold">
                Interview Complete
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400">
                You have completed your mock interview.
                Review your question status below.
              </p>

            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">

              <div className="rounded-2xl border border-white/5 bg-[#13243a] p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Answered
                </p>

                <p className="mt-2 text-3xl font-bold text-green-400">
                  {answeredCount}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  of {interviewQuestions.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#13243a] p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Skipped
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-400">
                  {skippedCount}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  questions
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#13243a] p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Not Attempted
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-400">
                  {unansweredCount}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  questions
                </p>
              </div>

            </div>

            <div className="mt-8 rounded-2xl border border-white/5 bg-[#13243a] p-6">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-semibold">
                    Completion
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Based on answered questions
                  </p>
                </div>

                <p className="text-2xl font-bold text-blue-400">
                  {completionPercentage}%
                </p>

              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">

                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                />

              </div>

            </div>

            <div className="mt-8">

              <div className="mb-4 flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold">
                    Question Review
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Review the status of every interview question.
                  </p>
                </div>

                <span className="text-xs font-semibold text-slate-500">
                  {interviewQuestions.length} questions
                </span>

              </div>

              <div className="space-y-3">

                {interviewQuestions.map((question, index) => {

                  const status =
                    questionStatus[index] ?? "unanswered";

                  const statusLabel =
                    status === "answered"
                      ? "Answered"
                      : status === "skipped"
                      ? "Skipped"
                      : "Not attempted";

                  const statusClass =
                    status === "answered"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : status === "skipped"
                      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      : "bg-slate-500/10 text-slate-400 border-slate-500/20";

                  return (
                    <div
                      key={`${index}-${question.question}`}
                      className="rounded-2xl border border-white/5 bg-[#13243a] p-5"
                    >

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div className="flex gap-4">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-xs font-bold text-blue-400">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <div>

                            {question.category && (
                              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-blue-400/70">
                                {question.category}
                              </p>
                            )}

                            <p className="text-sm font-semibold leading-6 text-slate-200">
                              {question.question}
                            </p>

                          </div>

                        </div>

                        <span
                          className={`w-fit shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${statusClass}`}
                        >
                          {statusLabel}
                        </span>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

            <button
              onClick={restartInterview}
              className="mt-8 w-full rounded-xl bg-blue-600 px-8 py-3.5 font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
            >
              Start New Interview
            </button>

          </div>

        </section>

      </main>
    );
  }

  /*
   * INTERVIEW SCREEN
   */

  const currentQuestionData =
    interviewQuestions[currentQuestion];

  const progress =
    ((currentQuestion + 1) /
      interviewQuestions.length) *
    100;

  const timeProgress =
    (seconds / 90) * 100;

  const currentStatus =
    questionStatus[currentQuestion] ?? "unanswered";

  const currentRecordedVideo =
    recordedVideos[currentQuestion] ?? null;

  const currentTestAnswer =
    testAnswerRecorded[currentQuestion] ?? false;

  return (
    <main className="min-h-screen bg-[#07111f] text-white">

      <header className="border-b border-white/10 bg-[#081526]">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-4">

            <img
              src="/idyllic-logo.png"
              alt="Idyllic"
              className="h-10 w-auto max-w-[200px] object-contain"
            />

            <div className="hidden h-8 w-px bg-white/10 sm:block" />

            <div className="hidden sm:block">

              <p className="text-sm font-semibold">
                Pre-CAS
              </p>

              <p className="text-xs text-slate-500">
                Mock Interview
              </p>

            </div>

          </div>

          <div className="rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-300">
            Question {currentQuestion + 1} of{" "}
            {interviewQuestions.length}
          </div>

        </div>

      </header>

      <div className="mx-auto max-w-7xl px-6 pt-6">

        <div className="mb-2 flex justify-between text-xs text-slate-500">

          <span>
            Interview progress
          </span>

          <span>
            {Math.round(progress)}%
          </span>

        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-white/5">

          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      <section className="mx-auto max-w-7xl px-6 py-8">

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">

          <div>

            <div className="relative aspect-video overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl">

              {cameraReady ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0c1b2e] to-[#07111f]">

                  <div className="text-center px-6">

                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-400/10 bg-blue-500/5 text-4xl">
                      🎤
                    </div>

                    <p className="font-semibold">
                      Testing Mode
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Camera and video recording are disabled.
                      You can still complete the interview flow.
                    </p>

                  </div>

                </div>
              )}

              {recording && (
                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-bold">

                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />

                  RECORDING

                </div>
              )}

            </div>

            <div className="mt-4 flex flex-wrap gap-3">

              {!recording &&
                !currentRecordedVideo &&
                !currentTestAnswer && (
                  <button
                    onClick={
                      cameraReady
                        ? startRealRecording
                        : startTestAnswer
                    }
                    className="rounded-xl bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-500"
                  >
                    {cameraReady
                      ? "Start Recording"
                      : "Start Test Answer"}
                  </button>
                )}

              {recording && (
                <button
                  onClick={stopAnswer}
                  className="rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-200"
                >
                  Stop Answer
                </button>
              )}

            </div>

          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#0d1b2d] p-7 shadow-xl">

            <div className="flex items-center justify-between">

              <span className="rounded-full border border-blue-400/10 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
                QUESTION{" "}
                {String(currentQuestion + 1).padStart(2, "0")}
              </span>

              <span
                className={
                  recording
                    ? "text-sm font-semibold text-red-400"
                    : "text-sm font-semibold text-slate-500"
                }
              >
                {recording ? `${seconds}s` : "90s"}
              </span>

            </div>

            {currentQuestionData?.category && (
              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-blue-400/80">
                {currentQuestionData.category}
              </p>
            )}

            <h1 className="mt-3 text-2xl font-bold leading-relaxed">
              {currentQuestionData?.question}
            </h1>

            <p className="mt-5 text-sm leading-6 text-slate-400">
              Take a moment to think about your answer. When
              you are ready, start your answer and respond
              naturally as if you were speaking to a university
              interviewer.
            </p>

            <div className="mt-8 rounded-2xl border border-white/5 bg-[#13243a] p-5">

              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Answer tips
              </p>

              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                <li>• Speak clearly and confidently.</li>
                <li>• Give specific reasons and examples.</li>
                <li>• Avoid memorising a scripted answer.</li>
                <li>• Look at the camera while answering.</li>
              </ul>

            </div>

            <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/5 bg-[#101f33] px-4 py-3">

              <span
                className={
                  currentStatus === "answered"
                    ? "h-2.5 w-2.5 rounded-full bg-green-400"
                    : currentStatus === "skipped"
                    ? "h-2.5 w-2.5 rounded-full bg-yellow-400"
                    : "h-2.5 w-2.5 rounded-full bg-slate-600"
                }
              />

              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {currentStatus === "answered"
                  ? "Answer recorded"
                  : currentStatus === "skipped"
                  ? "Question skipped"
                  : "Not attempted"}
              </span>

            </div>

            {recording && (
              <div className="mt-8">

                <div className="mb-2 flex justify-between text-xs text-slate-500">

                  <span>
                    Time remaining
                  </span>

                  <span className="font-semibold text-red-400">
                    {seconds} seconds
                  </span>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                  <div
                    className="h-full rounded-full bg-red-500 transition-all"
                    style={{
                      width: `${timeProgress}%`,
                    }}
                  />

                </div>

              </div>
            )}

            {error && (
              <div className="mt-6 rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-sm leading-6 text-red-300">
                {error}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">

              <button
                onClick={moveToPreviousQuestion}
                disabled={currentQuestion === 0 || recording}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Previous
              </button>

              <button
                onClick={skipQuestion}
                disabled={recording}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-400 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Skip
              </button>

              <button
                onClick={moveToNextQuestion}
                disabled={
                  recording ||
                  savingAnswer ||
                  (!currentRecordedVideo && !currentTestAnswer)
                }
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {currentQuestion ===
                interviewQuestions.length - 1
                  ? "Finish Interview"
                  : "Next Question"}
              </button>

            </div>

          </div>

        </div>

        {currentTestAnswer && (
          <div className="mt-8 rounded-[2rem] border border-green-500/20 bg-green-500/5 p-7">

            <h2 className="text-xl font-bold">
              Test answer recorded ✓
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              This is Testing Mode. No camera or video file was
              recorded, but the answer has been marked as completed.
            </p>

            {savingAnswer && (
              <p className="mt-3 text-sm text-blue-400">
                Saving your answer securely...
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">

              <button
                onClick={() => {
                  clearCurrentRecording();

                  setSeconds(90);

                  setQuestionStatus((previous) => {
                    const updated = [...previous];
                    updated[currentQuestion] = "unanswered";
                    return updated;
                  });
                }}
                className="rounded-xl border border-white/10 px-6 py-3 font-semibold text-slate-300 transition hover:bg-white/5"
              >
                Answer Again
              </button>

              <button
                onClick={moveToNextQuestion}
                disabled={savingAnswer}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {currentQuestion ===
                interviewQuestions.length - 1
                  ? "Finish Interview"
                  : "Continue"}
              </button>

            </div>

          </div>
        )}

        {currentRecordedVideo && (
          <div className="mt-8 rounded-[2rem] border border-green-500/20 bg-green-500/5 p-7">

            <h2 className="text-xl font-bold">
              Your answer has been recorded
            </h2>

            {savingAnswer && (
              <p className="mt-2 text-sm text-blue-400">
                Saving your answer securely...
              </p>
            )}

            <p className="mt-1 text-sm text-slate-400">
              Review your answer before continuing.
            </p>

            <video
              src={currentRecordedVideo}
              controls
              className="mt-6 w-full max-w-3xl rounded-2xl border border-white/10"
            />

            <div className="mt-5 flex flex-wrap gap-3">

              <button
                onClick={() => {
                  clearCurrentRecording();

                  setSeconds(90);

                  setQuestionStatus((previous) => {
                    const updated = [...previous];
                    updated[currentQuestion] = "unanswered";
                    return updated;
                  });
                }}
                className="rounded-xl border border-white/10 px-6 py-3 font-semibold text-slate-300 transition hover:bg-white/5"
              >
                Record Again
              </button>

              <button
                onClick={moveToNextQuestion}
                disabled={savingAnswer}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {currentQuestion ===
                interviewQuestions.length - 1
                  ? "Finish Interview"
                  : "Continue"}
              </button>

            </div>

          </div>
        )}

      </section>

    </main>
  );
}

