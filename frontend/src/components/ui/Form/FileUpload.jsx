import { forwardRef, useEffect, useMemo, useState } from "react";
import { Eye, FileText, Trash2, Upload, X } from "lucide-react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { showToast } from "@/utils/toast.util";
import ErrorText from "./ErrorText";
import { translateNumber } from "@/i18n/utils";

const FileUpload = forwardRef(
  (
    {
      className = "",
      allowedTypes = [],
      error = "",
      onChange,
      name,
      multiple = false, // ✅ new
      maxFiles = null, // ✅ optional (ex: 5)
      ...rest
    },
    ref
  ) => {
    const { t } = useTranslation();

    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const allowedTypesString = useMemo(() => {
      return allowedTypes.length > 0
        ? allowedTypes.map((t) => t.split("/")[1].toUpperCase()).join(", ")
        : "";
    }, [allowedTypes]);

    // ✅ cleanup previews on unmount
    useEffect(() => {
      return () => {
        files.forEach((f) => {
          if (f?.url) URL.revokeObjectURL(f.url);
        });
      };
    }, [files]);


    const emitChange = (nextFiles) => {
      if (onChange) {
        onChange({
          target: {
            name,
            value: nextFiles ? nextFiles.map((f) => f.file) : null,
          },
        });
      }
    };


    const handleFiles = (incomingFiles) => {
      if (!incomingFiles || incomingFiles.length === 0) return;

      const list = Array.from(incomingFiles);

      // validate types
      const validFiles = list.filter((uploadedFile) => {
        if (!uploadedFile) return false;

        if (allowedTypes.length > 0 && !allowedTypes.includes(uploadedFile.type)) {
          showToast(
            "warn",
            `${t("fields:file.error_message", { types: allowedTypesString })}`
          );
          return false;
        }

        return true;
      });

      if (validFiles.length === 0) return;

      // ✅ build next state OUTSIDE setFiles
      let next = [...files];

      validFiles.forEach((file) => {
        const url = URL.createObjectURL(file);

        next.push({
          id: crypto.randomUUID(),
          file,
          preview: file.type.startsWith("image/") ? url : null,
          url,
        });
      });

      // maxFiles
      if (maxFiles && next.length > maxFiles) {
        showToast("warn", t("fields:file.max_files_message", { max: translateNumber(maxFiles) }));
        next = next.slice(0, maxFiles);
      }

      // if multiple false keep last only
      if (!multiple) next = next.slice(-1);

      // ✅ now update state
      setFiles(next);

      // ✅ now emit to form
      emitChange(next);

      // reset input
      if (ref?.current) ref.current.value = null;
    };



    const handleChange = (e) => {
      handleFiles(e.target.files);
    };

    const handleRemoveFile = (id) => {
      const removed = files.find((f) => f.id === id);
      if (removed?.url) URL.revokeObjectURL(removed.url);

      const next = files.filter((f) => f.id !== id);

      setFiles(next);
      emitChange(next.length > 0 ? next : null);
    };


    const handleRemoveAll = () => {
      files.forEach((f) => {
        if (f?.url) URL.revokeObjectURL(f.url);
      });

      setFiles([]);

      if (ref?.current) ref.current.value = null;

      if (onChange) onChange({ target: { name, value: null } });
    };

    const handlePreviewClick = (url) => {
      if (url) window.open(url, "_blank");
    };

    // ✅ Drag & Drop
    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      handleFiles(e.dataTransfer.files);
    };

    return (
      <div className={clsx("w-full flex flex-col gap-1", className)}>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={clsx(
            "relative flex flex-col items-center justify-center gap-3 rounded-[10px] border-2 border-dashed px-6 py-10 transition-all duration-150",
            isDragging
              ? "border-(--blue-dark) bg-(--blue-lightest)"
              : "border-(--gray-light) bg-(--gray-lightest) hover:border-(--gray-light) hover:bg-(--gray-lightest)",
            error &&
              "border-(--red-dark) bg-(--red-lightest) hover:bg-(--red-lightest)"
          )}
        >
          <label className="w-full cursor-pointer flex flex-col items-center gap-3">
            <div className="rounded-full bg-white p-3 shadow-sm border border-(--gray-light)">
              <Upload className="text-(--blue-dark)" size={22} />
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-(--gray-dark)">
                {t("fields:file.buttons.click_or_drag")}
              </p>

              <p className="text-xs text-(--gray-dark)">
                {allowedTypes.length > 0
                  ? t("fields:file.allowed_message") + ": " + allowedTypesString
                  : t("fields:file.allowed_message")}
              </p>

              {maxFiles && (
                <p className="text-xs text-(--gray-dark) mt-1">
                  {t("fields:file.max_files_hint", { max: translateNumber(maxFiles) })}
                </p>
              )}
            </div>

            <input
              type="file"
              name={name}
              ref={ref}
              onChange={handleChange}
              className="hidden"
              accept={allowedTypes.join(",")}
              multiple={multiple} // ✅ new
              {...rest}
            />
          </label>
        </div>

        {/* ✅ Selected Files */}
        {files.length > 0 && (
          <div className="mt-3 rounded-xl border border-(--gray-light) bg-white overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-(--gray-lightest) border-b border-(--gray-light)">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-(--gray-dark)">
                  {t("fields:file.selected_files")}
                </p>

                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-(--blue-lightest) text-(--blue-dark)">
                  {translateNumber(files.length)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleRemoveAll}
                className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-(--red-dark) bg-white border border-(--gray-light) hover:bg-(--red-lightest) transition"
              >
                <Trash2 size={14} />
                {t("fields:file.buttons.remove_all")}
              </button>
            </div>

            {/* List */}
            <div className="flex flex-col">
              {files.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 border-b border-(--gray-light) last:border-b-0 hover:bg-(--gray-lightest) transition"
                >
                  {/* Left */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-(--blue-lightest) flex items-center justify-center">
                      <FileText size={18} className="text-(--blue-dark)" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-(--gray-dark) truncate">
                        {f.file.name}
                      </p>
                      <p className="text-xs text-(--gray-dark)">
                        {translateNumber((f.file.size / 1024 / 1024).toFixed(2))} MB
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePreviewClick(f.url)}
                      className="cursor-pointer inline-flex items-center justify-center w-9 h-9 rounded-lg border border-(--gray-light) bg-white hover:bg-(--green-lightest) transition"
                      title={t("fields:file.buttons.view_selected_file")}
                    >
                      <Eye size={16} className="text-(--green-dark)" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveFile(f.id)}
                      className="cursor-pointer inline-flex items-center justify-center w-9 h-9 rounded-lg border border-(--gray-light) bg-white hover:bg-(--red-lightest) transition"
                      title={t("fields:file.buttons.remove_file")}
                    >
                      <X size={16} className="text-(--red-dark)" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {error && <ErrorText error={error} />}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";
export default FileUpload;
