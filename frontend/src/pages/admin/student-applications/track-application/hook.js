import { useStudentApplication } from "@/hooks/api/students-applications.hooks";
import { useEffect, useRef, useState, useCallback } from "react";

export const useManageStudentApplicationData = (id) => {
    const { data, isLoading } = useStudentApplication(id)


  const profileData = data?.data?.data;
  const student = profileData?.student;

  const isFilled = (obj) => obj && Object.keys(obj).length > 0;
  
  const attachStudentID = (obj) =>
    obj ? { ...obj, student_id: student?.id } : obj;

  // Build completed steps first
  const completedSteps = {
    personalInfoCompleted: isFilled(profileData?.personal_info),
    residenceInfoCompleted: isFilled(profileData?.residence_info),
    preUniEduCompleted: isFilled(profileData?.pre_university_info),
    academicInfoCompleted: isFilled(profileData?.academic_info),
    guardianInfoCompleted: isFilled(profileData?.guardian_info),
    parentsStatusCompleted: isFilled(profileData?.parents_status),
    medicalInfoCompleted: isFilled(profileData?.medical_report),
    housingInfoCompleted: isFilled(profileData?.housing_info),
  };

  if (!student?.is_egyptian_national) {
    delete completedSteps.guardianInfoCompleted;
    delete completedSteps.parentsStatusCompleted;
  }
  if (!student?.is_new_student) {
    delete completedSteps.preUniEduCompleted;
  }

  const isCompleted = Object.values(completedSteps).every(Boolean);

  // Build return object
  const result = {
    data: profileData,
    student,
    personalInfo: profileData?.personal_info,
    residenceInfo: profileData?.residence_info,
    academicInfo: profileData?.academic_info,
    medicalInfo: profileData?.medical_report,
    housingInfo: profileData?.housing_info,
    documents: profileData?.documents,
    applicationResult: attachStudentID(profileData?.application_result),
    completedSteps,
    isCompleted,
    isFinallyAccepted: profileData?.application_result?.final_acceptance === "accepted",
    haveFaceId: profileData?.face_embedding,
    isLoading,
  };

  if (student?.is_egyptian_national) {
    result.guardianInfo = profileData?.guardian_info;
    result.parentsStatus = profileData?.parents_status;
  }
  if (student?.is_new_student) {
    result.preUniEdu = profileData?.pre_university_info
  }
  
  return result;
};

export default function useEnrollSocket(videoRef, studentID, isRunning) {
  const wsRef = useRef(null);
  const stopRef = useRef(false);

  const [status, setStatus] = useState("idle");
  const [framesCollected, setFramesCollected] = useState(0);
  const [framesRequired, setFramesRequired] = useState(15);
  const [message, setMessage] = useState("");

  const ws_url = `${import.meta.env.VITE_WS_ATTENDANCE_URL}/enroll`;

  // ---------------------------
  // CONNECT
  // ---------------------------
  const connect = useCallback(() => {
    if (!studentID) return;
    if (wsRef.current) return;

    const ws = new WebSocket(`${ws_url}/${studentID}`);

    ws.onopen = () => {
      console.log("Enroll WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        setStatus(data.status);
        setFramesCollected(data.frames_collected ?? 0);
        setFramesRequired(data.frames_required ?? 15);
        setMessage(data.message ?? "");

        // stop automatically when finished
        if (data.status === "success") {
          stopRef.current = true;
        }
      } catch (e) {
        console.log(e);
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
    };

    wsRef.current = ws;
  }, [studentID]);

  // ---------------------------
  // SEND FRAME
  // ---------------------------
  const sendFrame = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== 1) return;
    if (!videoRef.current) return;

    const video = videoRef.current;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      if (!wsRef.current || wsRef.current.readyState !== 1) return;

      wsRef.current.send(blob);
    }, "image/jpeg", 0.7);
  }, [videoRef]);

  // ---------------------------
  // LOOP
  // ---------------------------
  const startLoop = useCallback(async () => {
    stopRef.current = false;

    connect();

    while (!stopRef.current) {
      sendFrame();
      await new Promise((res) => setTimeout(res, 1000));
    }
  }, [connect, sendFrame]);

  const stopLoop = useCallback(() => {
    stopRef.current = true;
  }, []);

  // ---------------------------
  // EFFECT (MAIN FIX HERE)
  // ---------------------------
  useEffect(() => {
    if (!isRunning) {
      stopLoop();

      // ✅ close websocket when stopped
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      return;
    }

    startLoop();

    return () => {
      stopLoop();

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isRunning, startLoop, stopLoop]);

  // ---------------------------
  // CLEANUP ON UNMOUNT
  // ---------------------------
  useEffect(() => {
    return () => {
      stopRef.current = true;

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return {
    status,
    framesCollected,
    framesRequired,
    message,
    progress: Math.round((framesCollected / framesRequired) * 100),
  };
}