"use client";

import Link from "next/link";

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
  getSavedInterviewAnswers,
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

  const recordingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const recordingAnimationRef = useRef<number | null>(null);

  const parallaxImageRef = useRef<HTMLImageElement | null>(null);

  const videoBrandingLogo = "/idyllic-logo.png";

  const videoBrandingText =
    "This video was recorded as part of the Pre-CAS interview process for review of the student.\n\nIt is the property of Idyllic Education and may be used solely for evaluation and verification purposes.\n\nUnauthorised sharing, distribution, or reproduction is strictly prohibited.";

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
   * LOAD SAVED ANSWERS
   */
  useEffect(() => {
    if (!interviewComplete) {
      return;
    }

    let active = true;

    const loadSavedAnswers = async () => {
      try {
        const answers = await getSavedInterviewAnswers();

        if (!active) {
          return;
        }

        const restoredVideos: Record<number, string> = {};

        answers.forEach((answer) => {
          if (answer.interviewId !== interviewId || !answer.videoBlob) {
            return;
          }

          restoredVideos[answer.questionIndex] = URL.createObjectURL(
            answer.videoBlob
          );
        });

        setRecordedVideos(restoredVideos);
      } catch (loadError) {
        console.error("Unable to load saved interview answers:", loadError);
      }
    };

    loadSavedAnswers();

    return () => {
      active = false;
    };
  }, [interviewComplete, interviewId]);
  /*
 * FIRST PAGE PARALLAX EFFECT
 */
useEffect(() => {
  if (typeof window === "undefined") {
    return;
  }

  const mediaQuery = window.matchMedia("(min-width: 1024px)");

  if (!mediaQuery.matches) {
    return;
  }

  const handleMouseMove = (event: MouseEvent) => {
    const image = parallaxImageRef.current;

    if (!image) {
      return;
    }

    const x =
      (event.clientX / window.innerWidth - 0.5) * 35;

    const y =
      (event.clientY / window.innerHeight - 0.5) * 35;

    image.style.transform =
      `translate3d(${x}px, ${y}px, 0) scale(1.06)`;
  };

  window.addEventListener("mousemove", handleMouseMove);

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
  };
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
  /*
   * CREATE BRANDED RECORDING STREAM
   *
   * The camera and microphone remain the actual source.
   * The video is drawn onto a canvas so the saved recording
   * contains the official Idyllic branding and recording notice.
   */
  const createBrandedRecordingStream = async (
    sourceStream: MediaStream
  ): Promise<MediaStream> => {
    const sourceVideo = document.createElement("video");

    sourceVideo.srcObject = sourceStream;
    sourceVideo.muted = true;
    sourceVideo.playsInline = true;

    await sourceVideo.play();

    const canvas = document.createElement("canvas");

    canvas.width = 1280;
    canvas.height = 720;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Unable to create recording canvas.");
    }

    const logo = new Image();

    logo.src = videoBrandingLogo;

    await new Promise<void>((resolve, reject) => {
      logo.onload = () => resolve();
      logo.onerror = () =>
        reject(new Error("Unable to load the official logo."));
    });

    const drawFrame = () => {
      context.drawImage(
        sourceVideo,
        0,
        0,
        canvas.width,
        canvas.height
      );

      /*
       * Official Idyllic watermark.
       */
      const logoWidth = 120;
      const logoHeight =
        (logo.naturalHeight / logo.naturalWidth) * logoWidth;

      context.save();
      context.globalAlpha = 0.85;

      context.drawImage(
        logo,
        24,
        24,
        logoWidth,
        logoHeight
      );

      context.restore();

      /*
       * Recording-purpose notice.
       *
       * Displayed as a readable paragraph box in the
       * bottom-left of the saved interview recording.
       */
      const noticeWidth = 680;
      const noticeHeight = 190;
      const noticeX = 24;
      const noticeY = canvas.height - noticeHeight - 24;

      context.save();

      context.fillStyle = "rgba(0, 0, 0, 0.78)";
      context.beginPath();
      context.roundRect(
        noticeX,
        noticeY,
        noticeWidth,
        noticeHeight,
        18
      );
      context.fill();

      /*
       * Orange accent line.
       */
      context.fillStyle = "rgba(255, 153, 51, 0.95)";
      context.beginPath();
      context.roundRect(
        noticeX + 16,
        noticeY + 16,
        6,
        noticeHeight - 32,
        3
      );
      context.fill();

      /*
       * Draw the notice as multiple readable paragraphs.
       */
      const textX = noticeX + 40;
      const textWidth = noticeWidth - 62;

      const paragraphs = videoBrandingText.split("\n\n");

      let textY = noticeY + 38;

      paragraphs.forEach((paragraph, paragraphIndex) => {
        const isHeading = paragraphIndex === 0;

        context.fillStyle = isHeading
          ? "rgba(255, 255, 255, 0.96)"
          : "rgba(255, 255, 255, 0.92)";

        context.font = isHeading
          ? "bold 18px Arial"
          : "16px Arial";

        context.textAlign = "left";
        context.textBaseline = "top";

        const words = paragraph.split(" ");
        let line = "";

        const lineHeight = isHeading ? 24 : 22;

        words.forEach((word) => {
          const testLine = line
            ? `${line} ${word}`
            : word;

          if (
            context.measureText(testLine).width >
              textWidth &&
            line
          ) {
            context.fillText(line, textX, textY);
            textY += lineHeight;
            line = word;
          } else {
            line = testLine;
          }
        });

        if (line) {
          context.fillText(line, textX, textY);
          textY += lineHeight;
        }

        if (paragraphIndex < paragraphs.length - 1) {
          textY += 8;
        }
      });

      context.restore();

      recordingAnimationRef.current =
        requestAnimationFrame(drawFrame);
    };

    drawFrame();

    const canvasStream = canvas.captureStream(30);

    sourceStream.getAudioTracks().forEach((track) => {
      canvasStream.addTrack(track);
    });

    return canvasStream;
  };
  const startRealRecording = async () => {
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

      const brandedStream =
        await createBrandedRecordingStream(streamRef.current);

      const recorder = new MediaRecorder(brandedStream);

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
      <main className="min-h-screen overflow-x-hidden bg-[#f7f5f0] text-[#17212b]">
        <div className="relative min-h-screen">
                    {/* Official Idyllic top bar */}
          <div className="absolute left-0 top-0 z-30 h-[72px] w-full overflow-hidden">
            <img
              src="/top-bar.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
            />

            <img
              src="/idyllic-logo-white.png"
              alt="Idyllic Education"
              className="absolute left-6 top-1/2 h-12 w-auto -translate-y-1/2 object-contain sm:left-10 lg:left-14"
            />

            <div className="absolute right-6 top-1/2 -translate-y-1/2 sm:right-10 lg:right-14">
              <div className="flex items-center gap-5 sm:gap-7">
                <Link
                  href="/interview/answers"
                  className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85 transition hover:text-white sm:text-xs"
                >
                  Answer Reference
                </Link>

                <div className="h-5 w-px bg-white/25" />

                <Link
                  href="/interview/uk-study"
                  className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85 transition hover:text-white sm:text-xs"
                >
                  UK Study Support
                </Link>

                <div className="h-5 w-px bg-white/25" />

                <p className="text-right text-sm font-bold uppercase tracking-[0.16em] text-white drop-shadow-[0_0_7px_rgba(57,168,69,0.75)] sm:text-base">
                  Pre-CAS Interview Simulator
                </p>
              </div>
            </div>
          </div>
          {/* Large London visual */}
          <div className="pointer-events-none absolute inset-y-0 left-[14%] hidden w-[46%] overflow-hidden lg:block">
            <img
  ref={parallaxImageRef}
  src="/uk-watercolor.png"
  alt="London"
  className="h-full w-full object-cover object-center"
  style={{
    transition: "transform 180ms ease-out",
    willChange: "transform",
  }}
/>
            <div className="absolute inset-0 bg-gradient-to-r from-[#f7f5f0] via-transparent to-[#f7f5f0]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#f7f5f0]/35 via-transparent to-transparent" />
          </div>

          {/* Main content */}
          <div className="relative mx-auto flex min-h-screen w-full max-w-[1800px] items-center px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
            <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_520px] xl:grid-cols-[1fr_560px]">
              
              {/* Left editorial text */}
              <section className="relative hidden min-h-[680px] items-start lg:flex">
                <div className="relative z-10 max-w-[610px] pb-20">

                  <h1 className="mt-7 text-4xl font-semibold leading-[1.06] tracking-[-0.03em] text-[#17212b] xl:text-5xl">
                    Practice with confidence.
                    <br />
                    Prepare for your{" "}
                    <span className="text-[#243f9f]">
                      future in the UK.
                    </span>
                  </h1>

                  <p className="mt-7 max-w-[470px] text-base leading-7 text-[#66727d]">
                    AI-powered mock interview simulator built to help
                    international students succeed in their UK student visa
                    interviews.
                  </p>
                </div>
              </section>

              {/* Candidate panel */}
              <section className="relative z-20 w-full">
                <div className="rounded-[2rem] border border-black/5 bg-white/90 p-7 shadow-[0_30px_90px_rgba(23,33,43,0.12)] backdrop-blur-xl sm:p-9 xl:p-10">
                  
                  <div className="mb-8">
                    <div className="mb-5 h-[2px] w-10 bg-[#39a845]" />

                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#687580]">
                      Candidate Information
                    </p>

                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-[#17212b]">
                      Start your interview
                    </h2>

                    <p className="mt-2 text-sm text-[#7b858d]">
                      Enter your details below. Required fields are marked
                      with <span className="text-[#243f9f]">*</span>.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-[#303b45]">
                        Full Name <span className="text-[#243f9f]">*</span>
                      </label>

                      <input
                        value={fullName}
                        onChange={(event) =>
                          setFullName(event.target.value)
                        }
                        placeholder="Your full name"
                        className="w-full rounded-xl border border-[#dfe2e4] bg-white px-4 py-3.5 text-sm text-[#17212b] outline-none transition placeholder:text-[#aab1b6] focus:border-[#b51f2b] focus:ring-2 focus:ring-[#b51f2b]/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-[#303b45]">
                        Email Address <span className="text-[#243f9f]">*</span>
                      </label>

                      <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(event.target.value)
                        }
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-[#dfe2e4] bg-white px-4 py-3.5 text-sm text-[#17212b] outline-none transition placeholder:text-[#aab1b6] focus:border-[#b51f2b] focus:ring-2 focus:ring-[#b51f2b]/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-[#303b45]">
                        Contact Number{" "}
                        <span className="text-[#243f9f]">*</span>
                      </label>

                      <input
                        type="tel"
                        value={phone}
                        onChange={(event) =>
                          setPhone(event.target.value)
                        }
                        placeholder="Your contact number"
                        className="w-full rounded-xl border border-[#dfe2e4] bg-white px-4 py-3.5 text-sm text-[#17212b] outline-none transition placeholder:text-[#aab1b6] focus:border-[#b51f2b] focus:ring-2 focus:ring-[#b51f2b]/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-[#303b45]">
                        University
                      </label>

                      <input
                        value={university}
                        onChange={(event) =>
                          setUniversity(event.target.value)
                        }
                        placeholder="Your university"
                        className="w-full rounded-xl border border-[#dfe2e4] bg-white px-4 py-3.5 text-sm text-[#17212b] outline-none transition placeholder:text-[#aab1b6] focus:border-[#b51f2b] focus:ring-2 focus:ring-[#b51f2b]/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-[#303b45]">
                        Course
                      </label>

                      <input
                        value={course}
                        onChange={(event) =>
                          setCourse(event.target.value)
                        }
                        placeholder="Your course"
                        className="w-full rounded-xl border border-[#dfe2e4] bg-white px-4 py-3.5 text-sm text-[#17212b] outline-none transition placeholder:text-[#aab1b6] focus:border-[#b51f2b] focus:ring-2 focus:ring-[#b51f2b]/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-[#303b45]">
                        Intake
                      </label>

                      <input
                        value={intake}
                        onChange={(event) =>
                          setIntake(event.target.value)
                        }
                        placeholder="e.g. November 2026"
                        className="w-full rounded-xl border border-[#dfe2e4] bg-white px-4 py-3.5 text-sm text-[#17212b] outline-none transition placeholder:text-[#aab1b6] focus:border-[#b51f2b] focus:ring-2 focus:ring-[#b51f2b]/10"
                      />
                    </div>
                  </div>

                  <div className="mt-7 rounded-xl border border-[#ece7e1] bg-[#faf9f7] px-4 py-3.5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-[#303b45]">
                          Camera & microphone
                        </p>

                        <p className="mt-1 text-[11px] text-[#8a9298]">
                          {cameraReady
                            ? "Ready to record"
                            : "Required before the interview"}
                        </p>
                      </div>

                      <button
                        onClick={startCamera}
                        disabled={cameraReady}
                        className="shrink-0 rounded-lg border border-[#b51f2b]/30 px-3.5 py-2 text-xs font-semibold text-[#243f9f] transition hover:bg-[#b51f2b]/5 disabled:cursor-not-allowed disabled:border-green-600/20 disabled:text-green-700"
                      >
                        {cameraReady ? "Ready" : "Check"}
                      </button>
                    </div>
                  </div>

                  <p className="mt-5 text-[11px] leading-5 text-[#8a9298]">
                    Your information will be associated with this mock
                    interview.
                  </p>

                  <p className="mt-1 text-[11px] font-medium text-[#8a9298]">
                    Interview ID:{" "}
                    <span className="text-[#243f9f]">
                      {interviewId}
                    </span>
                  </p>

                  {error && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs leading-5 text-red-700">
                      {error}
                    </div>
                  )}

                  <button
  onClick={startInterview}
  className="group mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-[#243f9f] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-[#243f9f]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1d3485] hover:shadow-xl hover:shadow-[#243f9f]/20 active:translate-y-0"
>
  <span>Start Interview</span>

  <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
    &rarr;
  </span>
</button>

                <div className="mt-6 border-t border-[#e5e5e0] pt-5 text-center">
                  <p className="text-sm font-medium text-[#17212b]">
                    Have a suggestion or feedback?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#66727d]">
                    Help us improve your Pre-CAS interview experience.
                  </p>

                  <Link
                    href="/interview/feedback"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#25833a] transition hover:text-[#1d6f31]"
                  >
                    Share Feedback
                    <span>
                      &rarr;
                    </span>
                  </Link>
                </div>
              </div>
              </section>
            </div>
          </div>

          {/* Mobile introduction */}
          <div className="px-6 pb-8 lg:hidden">
            <div className="mx-auto max-w-xl">
              <div className="mb-5 h-[2px] w-10 bg-[#39a845]" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#687580]">
                Pre-CAS Interview Simulator
              </p>

              <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.03em] text-[#17212b]">
                Practice with confidence.
                <br />
                Prepare for your{" "}
                <span className="text-[#243f9f]">
                  future in the UK.
                </span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-6 text-[#66727d]">
                AI-powered mock interview simulator built to help
                international students succeed in their UK student visa
                interviews.
              </p>
            </div>
          </div>
        </div>
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

        <section className="mx-auto w-full max-w-[1600px] px-6 py-6 lg:px-10">
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











































































