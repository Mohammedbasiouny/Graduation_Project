import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useAiTasks } from "@/hooks/api/ai-tasks.hooks";
import { useEffect, useMemo, useState, useRef } from "react";
import { IconButton } from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";
import {
  formatToDateOnly,
  formatToTimeOnly,
} from "@/utils/format-date-and-time.utils";

import {
  FileArchive,
  Download,
  CheckCircle,
  Loader2,
  X,
  RefreshCw,
} from "lucide-react";

import { translateDate, translateNumber, translateTime } from "@/i18n/utils";

const AITasksCard = ({ className = "", ...rest }) => {
  const { t } = useTranslation();
  const { data, refetch } = useAiTasks();

  const [rows, setRows] = useState([]);
  const socketsRef = useRef({});

  // ================= LOAD TASKS =================
  useEffect(() => {
    if (!data?.data) return;

    const tasks = data.data.data ?? [];
    setRows(tasks);

    tasks.forEach((task) => {
      // connect only for processing tasks
      if (task.status === "processing" || task.status === "queued") {
        connectSocket(task.task_id);
      } else {
        // close socket if task no longer processing
        if (socketsRef.current[task.task_id]) {
          socketsRef.current[task.task_id].close();
          delete socketsRef.current[task.task_id];
        }
      }
    });

    return () => {
      Object.values(socketsRef.current).forEach((ws) => ws.close());
      socketsRef.current = {};
    };
  }, [data]);

  // ================= SOCKET =================
  const connectSocket = (taskId) => {
    if (socketsRef.current[taskId]) return;

    const ws = new WebSocket(
      `${import.meta.env.VITE_WS_AI_TASKS_URL}/ws/tasks/${taskId}`
    );

    socketsRef.current[taskId] = ws;

    ws.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);

        setRows((prev) =>
          prev.map((t) =>
            t.task_id === taskId
              ? { ...t, ...update }
              : t
          )
        );

        // close socket when task finished/failed
        if (
          update.status &&
          update.status !== "processing" &&
          update.status !== "queued"
        ) {
          ws.close();
          delete socketsRef.current[taskId];
        }
      } catch (e) {
        console.error("WS error:", e);
      }
    };

    ws.onclose = () => {
      delete socketsRef.current[taskId];
    };

    ws.onerror = (err) => {
      console.error("WS error:", err);
    };
  };

  // ================= STATS =================
  const stats = useMemo(() => {
    return rows.reduce(
      (acc, task) => {
        acc.total += 1;

        if (task.status === "finished") acc.finished += 1;
        else if (task.status === "processing") acc.processing += 1;
        else if (task.status === "queued") acc.queued += 1;
        else acc.failed += 1;

        return acc;
      },
      { total: 0, finished: 0, processing: 0, queued: 0, failed: 0 }
    );
  }, [rows]);

  const getStatus = (status) => {
    switch (status) {
      case "finished":
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
          text: t("manage-acceptance:ai-tasks.status.finished"),
        };
      case "processing": 
        return { 
          icon: <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />, 
          text: t("manage-acceptance:ai-tasks.status.processing"), 
        }; 
      case "queued": 
        return { 
          icon: <Loader2 className="w-4 h-4 text-gray-500 animate-pulse" />, 
          text: t("manage-acceptance:ai-tasks.status.queued"), 
        };
      default:
        return {
          icon: <X className="w-4 h-4 text-red-500" />,
          text: t("manage-acceptance:ai-tasks.status.failed"),
        };
    }
  };

  const isFinished = (status) => status === "finished";

  const handleDownload = async (task) => {
    if (!isFinished(task.status)) return;

    const url = `${import.meta.env.VITE_API_AI_TASKS_URL}/tasks/${task.task_id}/download`;
    if (!url) return;

    try {
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${task.task_id}.docx`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  return (
    <div
      className={clsx(
        "w-full h-full rounded-lg border border-(--gray-light) bg-white shadow-md p-5 flex flex-col",
        className
      )}
      {...rest}
    >
      {/* HEADER */}
      <div className="flex flex-col pb-3 border-b border-gray-100 shrink-0">
        <div className="flex flex-wrap items-center justify-between">
          <div className="space-y-2">
            <p className="text-lg font-semibold text-(--primary-dark)">
              {t("manage-acceptance:ai-tasks.title")}
            </p>

            <p className="text-sm">
              {t("manage-acceptance:ai-tasks.subtitle")}
            </p>
          </div>

          <Tooltip content={t("buttons:reload")}>
            <IconButton
              size="sm"
              icon={RefreshCw}
              onClick={() => refetch()}
              className="text-yellow-600 bg-yellow-50 rounded-md p-1"
            />
          </Tooltip>
        </div>

        {/* STATS */}
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          <span className="px-2 py-1 rounded-lg bg-gray-100">
            {t("manage-acceptance:ai-tasks.stats.total")}: {stats.total === 0 ? t("NA") : translateNumber(stats.total)}
          </span>

          <span className="px-2 py-1 rounded-lg bg-green-100 text-green-700">
            {t("manage-acceptance:ai-tasks.stats.finished")}: {stats.finished === 0 ? t("NA") : translateNumber(stats.finished)}
          </span>

          <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-700">
            {t("manage-acceptance:ai-tasks.stats.processing")}: {stats.processing === 0 ? t("NA") : translateNumber(stats.processing)}
          </span>

          <span className="px-2 py-1 rounded-lg bg-red-100 text-red-700">
            {t("manage-acceptance:ai-tasks.stats.failed")}: {stats.failed === 0 ? t("NA") : translateNumber(stats.failed)}
          </span>
        </div>
      </div>

      {/* SCROLLABLE LIST */}
      <div className="flex-1 overflow-y-auto mt-3 space-y-3 pr-1 max-h-[60vh]">
        {rows.map((task) => {
          const status = getStatus(task.status);

          return (
            <div
              key={task.task_id}
              className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-100 bg-white"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100">
                  <FileArchive className="w-5 h-5 text-indigo-600" />
                </div>

                <div className="flex flex-col min-w-0 gap-2">
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {task.file_name}
                  </span>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {status.icon}
                    <span>{status.text}</span>
                    <span>•</span>
                    <span>
                      {formatToDateOnly(translateDate(task.created_at))}{" "}
                      {formatToTimeOnly(translateTime(task.created_at))}
                    </span>
                  </div>

                  {/* 🔥 PROGRESS BAR */}
                  {task.status === "processing" && (
                    <div className="flex gap-2 items-center">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-blue-500 h-1 rounded-full transition-all"
                          style={{
                            width: `${task.progress ?? 0}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {translateNumber(task.progress ?? 0)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* DOWNLOAD */}
              <Tooltip content={t("buttons:download")}>
                <span>
                  <IconButton
                    icon={Download}
                    disabled={!isFinished(task.status)}
                    onClick={() => handleDownload(task)}
                    className={clsx(
                      "rounded-md p-1 transition",
                      isFinished(task.status)
                        ? "text-green-600 bg-green-50 hover:bg-green-100"
                        : "text-gray-400 bg-gray-100 cursor-not-allowed opacity-50"
                    )}
                  />
                </span>
              </Tooltip>
            </div>
          );
        })}

        {/* EMPTY */}
        {rows.length === 0 && (
          <div className="text-sm text-center text-gray-500 py-10">
            {t("manage-acceptance:ai-tasks.empty")}
          </div>
        )}
      </div>
    </div>
  );
};

export default AITasksCard;