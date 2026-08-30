"use client";

import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";

import {
  getRandomInterviewQuestions,
  getPersonalizedInterviewQuestions,
  shortInterviewQuestions,
  interviewQuestions,
  coreInterviewQuestions,
} from "@/data/questions";

import {
  saveInterviewAnswer,
  saveInterviewSession,
  clearSavedInterviewAnswers,
} from "@/app/interview/lib/interviewStorage";

type Question = {
  id: number;
  question: string;
  category?: string;
  preparationTime?: number;
  answerTime?: number;
};

type QuestionStatus = "unanswered" | "answered" | "skipped";

export default function InterviewStartPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const interviewVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [interviewQuestions, setInterviewQuestions] = useState<Question[]>([]);
  const [questionStatus, setQuestionStatus] = useState<QuestionStatus[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [cameraReady, setCameraReady] = useState(false);
  const [recording, setRecording] = useState(false);

  const [interviewPhase, setInterviewPhase] = useState<
    "preparation" | "answer"
  >("preparation");

  const [seconds, setSeconds] = useState(15);

  const [recordedVideos, setRecordedVideos] = useState<
    Record<number, string>
  >({});

  const [error, setError] = useState("");
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [savingAnswer, setSavingAnswer] = useState(false);

  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewStartedAt, setInterviewStartedAt] = useState<string | null>(
    null
  );

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
    if (!interviewStarted) {
      return;
    }

    if (seconds <= 0) {
      if (interviewPhase === "preparation") {
        if (cameraReady) {
          startRealRecording();
        } else {
          setError(
            "Please enable your camera and microphone before recording."
          );
        }
      } else if (interviewPhase === "answer") {
        stopAnswer();
      }

      return;
    }

    const timer = window.setTimeout(() => {
      setSeconds((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [interviewStarted, interviewPhase, seconds, cameraReady]);

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
  }, []);

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
      console.log("Camera tracks:", stream.getVideoTracks().length);
console.log("Microphone tracks:", stream.getAudioTracks().length);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraReady(true);
    } catch (cameraError) {
      console.error(cameraError);

      setError(
        "Camera or microphone access was denied. Please enable your camera and microphone to continue."
      );
    }
  };

  /*
   * ATTACH CAMERA STREAM TO VIDEO PREVIEWS
   */
  useEffect(() => {
    if (!cameraReady || !streamRef.current) {
      return;
    }

    const attachStream = (video: HTMLVideoElement | null) => {
      if (!video) {
        return;
      }

      video.srcObject = streamRef.current;
      video.play().catch(() => {});
    };

    attachStream(videoRef.current);
    attachStream(interviewVideoRef.current);
  }, [cameraReady, interviewStarted]);

  /*
   * START INTERVIEW
   */
  const startInterview = async () => {
    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name before starting the interview.");
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address before starting the interview.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!trimmedPhone) {
      setError("Please enter your contact number before starting the interview.");
      return;
    }

    const phoneDigits = trimmedPhone.replace(/\D/g, "");

    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      setError("Please enter a valid contact number.");
      return;
    }

    const personalizedQuestions = getPersonalizedInterviewQuestions(
      university.trim(),
      course.trim(),
      intake.trim(),
      4
    );

    /*
     * Prevent the general question pool from selecting the same
     * personalized question IDs.
     */
    const personalizedIds = personalizedQuestions.map(
      (question) => question.id
    );

    /*
     * Exclude known duplicate questions.
     */
    const duplicateQuestionIds = [9, 10, 27, 84];

    const excludedQuestionIds = [
      ...personalizedIds,
      ...duplicateQuestionIds,
    ];

    /*
     * Build the 12 additional questions:
     * 4 short-answer questions = 30 seconds
     * 8 normal questions = 90 seconds
     */
    const availableShortQuestions = shortInterviewQuestions.filter(
      (question) =>
        !excludedQuestionIds.includes(question.id)
    );

    const availableNormalQuestions = interviewQuestions.filter(
      (question) =>
        !excludedQuestionIds.includes(question.id)
    );

    /*
     * Select exactly 4 short-answer questions.
     */
    const shortQuestions = [...availableShortQuestions];

    for (let i = shortQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shortQuestions[i], shortQuestions[j]] = [
        shortQuestions[j],
        shortQuestions[i],
      ];
    }

    const selectedShortQuestions = shortQuestions.slice(0, 4);

    /*
     * Select exactly 8 normal 90-second questions.
     */
    const normalQuestions = [...availableNormalQuestions];

    for (let i = normalQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [normalQuestions[i], normalQuestions[j]] = [
        normalQuestions[j],
        normalQuestions[i],
      ];
    }

    const selectedNormalQuestions = normalQuestions.slice(0, 8);

    /*
     * Final interview:
     * 4 personalized/core + 4 short + 8 normal = 16.
     */
    const combinedQuestions: Question[] = [
      ...personalizedQuestions,
      ...selectedShortQuestions,
      ...selectedNormalQuestions,
    ];
    /*
     * Randomise the final 16-question interview.
     */
    for (let i = combinedQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [combinedQuestions[i], combinedQuestions[j]] = [
        combinedQuestions[j],
        combinedQuestions[i],
      ];
    }

    setInterviewQuestions(combinedQuestions);

    setQuestionStatus(
      combinedQuestions.map(() => "unanswered")
    );

    setCurrentQuestion(0);
    setInterviewPhase("preparation");

    setSeconds(
      combinedQuestions[0]?.preparationTime ?? 15
    );

    setInterviewStartedAt(new Date().toISOString());
    setInterviewStarted(true);

    /*
     * Save interview session information.
     */
    try {
await saveInterviewSession({
  interviewId,
  fullName: fullName.trim(),
  phone: phoneDigits,
  university: university.trim(),
  course: course.trim(),
  intake: intake.trim(),
  startedAt: new Date().toISOString(),
});
    } catch (saveError) {
      console.error("Unable to save interview session:", saveError);
    }
  };

  /*
   * REAL RECORDING
   */
  const startRealRecording = () => {
    if (!streamRef.current) {
      setError("Please enable the camera and microphone first.");
      return;
    }

    if (recording) {
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

      recorder.onstop = async () => {
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

        const question = interviewQuestions[currentQuestion];

        try {
          if (question) {
            setSavingAnswer(true);

            const answerTime = question.answerTime ?? 90;

            await saveInterviewAnswer(
              {
                interviewId,
                questionIndex: currentQuestion,
                question: question.question,
                category: question.category,
                status: "answered",
                recordedAt: new Date().toISOString(),
                duration: Math.max(0, answerTime - seconds),
              },
              blob
            );
          }
        } catch (saveError) {
          console.error(
            "Unable to save recorded interview answer:",
            saveError
          );
        } finally {
          setSavingAnswer(false);
        }

        /*
         * Automatically continue after the recording
         * has been saved.
         */
        if (currentQuestion < interviewQuestions.length - 1) {
          const nextQuestionIndex = currentQuestion + 1;

          setCurrentQuestion(nextQuestionIndex);

          const nextQuestion =
            interviewQuestions[nextQuestionIndex];

          setInterviewPhase("preparation");

          setSeconds(
            nextQuestion?.preparationTime ?? 15
          );
        } else {
          /*
           * Question 16 is complete.
           * Stop the interview and show the final
           * recording review screen.
           */
          setInterviewComplete(true);
          setInterviewStarted(false);
          setInterviewPhase("preparation");
          setSeconds(0);
        }
      };
      recorder.start();

      const answerTime =
        interviewQuestions[currentQuestion]?.answerTime ?? 90;

      setInterviewPhase("answer");
      setSeconds(answerTime);
      setRecording(true);
    } catch (recordingError) {
      console.error(recordingError);

      setError("Unable to start recording on this browser.");
    }
  };
  /*
   * DOWNLOAD ALL RECORDED VIDEOS
   */
  const downloadAllRecordedVideos = async () => {
    const entries = Object.entries(recordedVideos);

    if (entries.length === 0) {
      setError("No recorded videos are available to download.");
      return;
    }

    try {
      setError("");

      const zip = new JSZip();

      for (const [questionIndex, videoUrl] of entries) {
        const index = Number(questionIndex);

        const response = await fetch(videoUrl);
        const blob = await response.blob();

        zip.file(
          `Pre-CAS-Interview-Q${String(index + 1).padStart(2, "0")}.webm`,
          blob
        );
      }

      const zipBlob = await zip.generateAsync({
        type: "blob",
      });

      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = `Pre-CAS-Interview-${interviewId}.zip`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(downloadUrl);
    } catch (downloadError) {
      console.error(
        "Unable to download recorded videos:",
        downloadError
      );

      setError("Unable to create the interview video download.");
    }
  };

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
  };

  /*
   * START PREPARATION FOR CURRENT QUESTION
   */
  const startPreparationForCurrentQuestion = () => {
    const preparationTime =
      interviewQuestions[currentQuestion]?.preparationTime ?? 15;

    setInterviewPhase("preparation");
    setSeconds(preparationTime);
  };

  /*
   * NEXT QUESTION
   */
  const moveToNextQuestion = async () => {
    if (recording || savingAnswer) {
      return;
    }

    if (currentQuestion < interviewQuestions.length - 1) {
      const nextQuestionIndex = currentQuestion + 1;

      setCurrentQuestion(nextQuestionIndex);

      const nextQuestion =
        interviewQuestions[nextQuestionIndex];

      setInterviewPhase("preparation");

      setSeconds(
        nextQuestion?.preparationTime ?? 15
      );
    } else {
      setInterviewComplete(true);
    }
  };


  /*
   * SKIP QUESTION
   */
  const skipQuestion = async () => {
    if (recording || savingAnswer) {
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
        console.error(
          "Unable to save skipped question:",
          saveError
        );
      }
    }

    clearCurrentRecording();

    setQuestionStatus((previous) => {
      const updated = [...previous];
      updated[currentQuestion] = "skipped";
      return updated;
    });

    if (currentQuestion < interviewQuestions.length - 1) {
      const nextQuestionIndex = currentQuestion + 1;

      setCurrentQuestion(nextQuestionIndex);

      const nextQuestion =
        interviewQuestions[nextQuestionIndex];

      setInterviewPhase("preparation");

      setSeconds(
        nextQuestion?.preparationTime ?? 15
      );
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
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());
    }

    streamRef.current = null;

    Object.values(recordedVideos).forEach((videoUrl) => {
      URL.revokeObjectURL(videoUrl);
    });

    const questions = getRandomInterviewQuestions();

    setInterviewQuestions(questions);
    setQuestionStatus(
      questions.map(() => "unanswered")
    );

    setCurrentQuestion(0);

    setCameraReady(false);
    setRecording(false);

    setInterviewPhase("preparation");

    setSeconds(
      questions[0]?.preparationTime ?? 15
    );

    setRecordedVideos({});


    setError("");
    setInterviewComplete(false);

    setInterviewStarted(false);
    setInterviewStartedAt(null);

    recorderRef.current = null;
    chunksRef.current = [];
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

        <section className="mx-auto w-full max-w-[1600px] px-5 py-4 lg:px-8">
          <div className="grid w-full gap-5 lg:grid-cols-[1.18fr_0.82fr] xl:gap-8">
            <div className="rounded-[1.5rem] border border-white/10 bg-[#0d1b2d] p-5 shadow-2xl sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                Pre-CAS Preparation
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Prepare for your  
                <span className="block text-blue-400">
                  university interview.
                </span>
              </h1>

              <p className="mt-3 text-sm leading-5 text-slate-400">
                This mock interview is designed to help you
                practise answering university-style questions
                naturally and confidently before your actual
                Pre-CAS interview.
              </p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-white/5 bg-[#13243a] p-3">
                  <div className="text-2xl">
                    {String.fromCodePoint(0x1f3a5)}
                  </div>

                  <p className="mt-1.5 text-sm font-semibold">
                    Camera & microphone
                  </p>

                  <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
                    Camera and microphone recording are available
                    when your device supports them.
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-[#13243a] p-3">
                  <div className="text-2xl">
                    {String.fromCodePoint(0x23f1)}
                  </div>

                  <p className="mt-1.5 text-sm font-semibold">
                    90 seconds per answer
                  </p>

                  <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
                    Take a moment to think, then answer naturally
                    within the time limit.
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-[#13243a] p-3">
                  <div className="text-2xl">
                    {String.fromCodePoint(0x2713)}
                  </div>

                  <p className="mt-1.5 text-sm font-semibold">
                    {interviewQuestions.length} questions
                  </p>

                  <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
                    Your interview contains a randomly selected
                    set of questions.
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-[#13243a] p-3">
                  <div className="text-2xl">
                    {String.fromCodePoint(0x1f504)}
                  </div>

                  <p className="mt-1.5 text-sm font-semibold">
                    Review & re-record
                  </p>

                  <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
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
                  <li>- Find a quiet and well-lit place.</li>
                  <li>- Keep your face clearly visible on camera.</li>
                  <li>
                    - Answer in your own words rather than memorising
                    a script.
                  </li>
                  <li>
                    - Speak clearly and maintain eye contact with
                    the camera.
                  </li>
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
                      Email Address
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="Enter your email address"
                      className="w-full rounded-xl border border-white/10 bg-[#0b1829] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Contact Number
                    </label>

                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      placeholder="Enter your contact number"
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
                  Your information will be associated with this mock
                  interview.
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
                          {String.fromCodePoint(0x1f3a5)}
                        </div>

                        <p className="font-semibold">
                          Camera preview
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          Enable your camera and microphone before starting the interview.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={startCamera}
                disabled={cameraReady}
                className="w-full rounded-xl border border-white/10 bg-[#0d1b2d] px-6 py-3 font-semibold text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cameraReady
                  ? "Camera & Microphone Ready"
                  : "Enable Camera & Microphone"}
              </button>

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
                      16
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-sm text-slate-400">
                      Preparation
                    </span>

                    <span className="font-semibold">
                      15 seconds
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
                      "Video + Audio"
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
          <div className="rounded-[1.5rem] border border-white/10 bg-[#0d1b2d] p-5 shadow-2xl sm:p-6">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-4xl text-green-400">
                {String.fromCodePoint(0x2713)}
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
              <div className="rounded-xl border border-white/5 bg-[#13243a] p-3 text-center">
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

              <div className="rounded-xl border border-white/5 bg-[#13243a] p-3 text-center">
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

              <div className="rounded-xl border border-white/5 bg-[#13243a] p-3 text-center">
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
                      className="rounded-xl border border-white/5 bg-[#13243a] p-3"
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

                        <div className="mt-8">
              <div className="mb-4">
                <h2 className="text-xl font-bold">
                  Recorded Answers
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review the answers recorded during this interview.
                </p>
              </div>

              <div className="space-y-5">
                {Object.entries(recordedVideos).map(
                  ([questionIndex, videoUrl]) => {
                    const index = Number(questionIndex);
                    const question = interviewQuestions[index];

                    if (!question) {
                      return null;
                    }

                    return (
                      <div
                        key={`recorded-${index}`}
                        className="rounded-xl border border-white/5 bg-[#13243a] p-3"
                      >
                        <div className="mb-4 flex items-start gap-4">
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

                        <video
                          src={videoUrl}
                          controls
                          playsInline
                          className="w-full rounded-2xl border border-white/10 bg-black"
                        />

                        <a
                          href={videoUrl}
                          download={`Pre-CAS-Interview-Q${String(index + 1).padStart(2, "0")}.webm`}
                          className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                        >
                          Download Video
                        </a>
                      </div>
                    );
                  }
                )}
              </div>
            </div>            
            <button
              onClick={downloadAllRecordedVideos}
              className="mt-4 w-full rounded-xl border border-blue-400/20 bg-blue-500/10 px-8 py-3.5 font-semibold text-blue-300 transition hover:bg-blue-500/20"
            >
              Download All Videos
            </button>

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

  const currentTimeLimit =
    interviewPhase === "preparation"
      ? currentQuestionData?.preparationTime ?? 15
      : currentQuestionData?.answerTime ?? 90;

  const timeProgress =
    currentTimeLimit > 0
      ? (seconds / currentTimeLimit) * 100
      : 0;

  const currentStatus =
    questionStatus[currentQuestion] ?? "unanswered";

  const currentRecordedVideo =
    recordedVideos[currentQuestion] ?? null;
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
          <span>Interview progress</span>

          <span>{Math.round(progress)}%</span>
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
              {cameraReady && (
                <video
                  ref={interviewVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
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
                (
                  <button
                    onClick={startRealRecording}
                    className="rounded-xl bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-500"
                  >
                    Start Recording
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
                    : interviewPhase === "preparation"
                    ? "text-sm font-semibold text-blue-400"
                    : "text-sm font-semibold text-slate-500"
                }
              >
                {interviewPhase === "preparation"
                  ? `${seconds}s preparation`
                  : recording
                  ? `${seconds}s`
                  : `${currentQuestionData?.answerTime ?? 90}s`}
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
              {interviewPhase === "preparation"
                ? "Take a moment to think about your answer. Your answer timer will begin automatically when preparation time ends."
                : "Respond naturally as if you were speaking to a university interviewer."}
            </p>

            <div className="mt-8 rounded-xl border border-white/5 bg-[#13243a] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Answer tips
              </p>

              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                <li>- Speak clearly and confidently.</li>
                <li>- Give specific reasons and examples.</li>
                <li>- Avoid memorising a scripted answer.</li>
                <li>- Look at the camera while answering.</li>
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

            {interviewPhase === "preparation" && (
              <div className="mt-8">
                <div className="mb-2 flex justify-between text-xs text-slate-500">
                  <span>Preparation time</span>

                  <span className="font-semibold text-blue-400">
                    {seconds} seconds
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{
                      width: `${timeProgress}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {recording && (
              <div className="mt-8">
                <div className="mb-2 flex justify-between text-xs text-slate-500">
                  <span>Time remaining</span>

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
                onClick={skipQuestion}
                disabled={recording || savingAnswer}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-400 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
</section>
    </main>
  );
}










































