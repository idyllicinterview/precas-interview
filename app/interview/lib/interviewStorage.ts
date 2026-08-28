export type SavedInterviewAnswer = {
  interviewId: string;
  questionIndex: number;
  question: string;
  category?: string;
  status: "answered" | "skipped";
  recordedAt: string;
  duration: number;
  videoBlob?: Blob | null;
};

export type SavedInterviewSession = {
  interviewId: string;
  fullName: string;
  email?: string;
  phone?: string;
  university: string;
  course: string;
  intake: string;
  startedAt: string;
  completedAt?: string;
  totalQuestions?: number;
  answeredCount?: number;
  skippedCount?: number;
  completionPercentage?: number;
};

const DB_NAME = "precas-interview-db";
const STORE_NAME = "answers";
const INTERVIEW_STORE_NAME = "interviews";
const DB_VERSION = 4;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }

      if (db.objectStoreNames.contains(INTERVIEW_STORE_NAME)) {
        db.deleteObjectStore(INTERVIEW_STORE_NAME);
      }

      db.createObjectStore(STORE_NAME, {
        keyPath: ["interviewId", "questionIndex"],
      });

      db.createObjectStore(INTERVIEW_STORE_NAME, {
        keyPath: "interviewId",
      });
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveInterviewSession(
  session: SavedInterviewSession
): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      INTERVIEW_STORE_NAME,
      "readwrite"
    );

    const store = transaction.objectStore(
      INTERVIEW_STORE_NAME
    );

    store.put(session);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

export async function getInterviewSession(
  interviewId: string
): Promise<SavedInterviewSession | null> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      INTERVIEW_STORE_NAME,
      "readonly"
    );

    const store = transaction.objectStore(
      INTERVIEW_STORE_NAME
    );

    const request = store.get(interviewId);

    request.onsuccess = () => {
      db.close();
      resolve(request.result ?? null);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

export async function saveInterviewAnswer(
  answer: SavedInterviewAnswer,
  videoBlob?: Blob
): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      "readwrite"
    );

    const store = transaction.objectStore(
      STORE_NAME
    );

    store.put({
      ...answer,
      videoBlob: videoBlob ?? null,
    });

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

export async function getSavedInterviewAnswers(): Promise<
  Array<SavedInterviewAnswer & { videoBlob: Blob | null }>
> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      "readonly"
    );

    const store = transaction.objectStore(
      STORE_NAME
    );

    const request = store.getAll();

    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

export async function clearSavedInterviewAnswers(): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      "readwrite"
    );

    const store = transaction.objectStore(
      STORE_NAME
    );

    store.clear();

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

export async function clearInterviewSessions(): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      INTERVIEW_STORE_NAME,
      "readwrite"
    );

    const store = transaction.objectStore(
      INTERVIEW_STORE_NAME
    );

    store.clear();

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}
