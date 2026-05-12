import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Form/Choice';
import Heading from '@/components/ui/Heading';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Table, TData, TRow } from '@/components/ui/Table';
import { useGrantPermissions } from '@/hooks/api/manage-users.hook';
import { translateNumber } from '@/i18n/utils';
import { showToast } from '@/utils/toast.util';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const GrantPermissionsSection = ({ userID = "", userPermissions = [] }) => {
  const { t } = useTranslation();

  const permissions = useMemo(() => {
    const raw = t("permissions:permissions", {
      returnObjects: true,
      defaultValue: {},
    });

    return typeof raw === "object" && raw !== null ? raw : {};
  }, [t]);

  const [selectedPermissions, setSelectedPermissions] = useState([]);

  /* ---------------- Toggle Single Permission ---------------- */
  const togglePermission = useCallback((permKey) => {
    setSelectedPermissions((prev) =>
      prev.includes(permKey)
        ? prev.filter((key) => key !== permKey)
        : [...prev, permKey]
    );
  }, []);

  /* ---------------- Toggle All Permissions ---------------- */
  const selectAllPermissions = useCallback(() => {
    const allPerms = Object.values(permissions).flatMap(
      (section) => Object.keys(section?.children || {})
    );

    const allSelected = allPerms.every((p) => selectedPermissions.includes(p));

    setSelectedPermissions(allSelected ? [] : allPerms);
  }, [permissions, selectedPermissions]);

  /* ---------------- Select/Deselect Category ---------------- */
  const selectAllInCategory = useCallback(
    (categoryKey) => {
      const category = permissions?.[categoryKey];
      if (!category?.children) return;

      const categoryPerms = Object.keys(category.children);

      setSelectedPermissions((prev) => {
        const allSelected = categoryPerms.every((p) => prev.includes(p));

        // deselect all
        if (allSelected) {
          return prev.filter((p) => !categoryPerms.includes(p));
        }

        // select all
        return [...new Set([...prev, ...categoryPerms])];
      });
    },
    [permissions]
  );

  /* ---------------- API ---------------- */
  const {
    mutate: grantPermissionsMutate,
    isPending: isGrantingPermissions,
    error,
    isError,
    isSuccess,
  } = useGrantPermissions();

  const handleSubmit = () => {
    grantPermissionsMutate({
      id: userID,
      data: { permissions: selectedPermissions },
    });
  };

  /* ---------------- Columns ---------------- */
  const columns = useMemo(
    () => [t("permissions:parent"), t("permissions:childrens")],
    [t]
  );

  /* ---------------- Toasts ---------------- */
  useEffect(() => {
    if (isSuccess) {
      showToast("success", t("messages:updated_successfully"));
    }
  }, [isSuccess, t]);

  useEffect(() => {
    if (!isError) return;

    const res = error?.response;

    if (res?.status === 404) {
      showToast("error", t("messages:update_not_found"));
    } else if (res?.status === 400) {
      showToast("error", t("messages:validation_error"));
    } else {
      showToast("error", t("messages:something_went_wrong"));
    }
  }, [isError, error, t]);

  /* ---------------- Prefill Permissions ---------------- */
  useEffect(() => {
    setSelectedPermissions(Array.isArray(userPermissions) ? userPermissions : []);
  }, [userPermissions]);

  /* ---------------- Global Select All ---------------- */
  const allPermissionsKeys = useMemo(
    () => Object.values(permissions).flatMap((section) => Object.keys(section.children || {})),
    [permissions]
  );

  const allSelectedGlobally = allPermissionsKeys.every((p) => selectedPermissions.includes(p));

  return (
    <div className='bg-white rounded-2xl shadow-md p-5 md:p-8 space-y-5 transition'>
      <Heading
        title={t('account:view_permissions_heading.title')}
        subtitle={t('account:view_permissions_heading.subtitle')}
        size="sm"
        align="start"
      />

      {/* Global Select All */}
      <div className="flex justify-between items-center">
        <p className='text-base text-gray-500'>
          {t("account:permissions_count", { count: translateNumber(userPermissions.length), total: translateNumber(allPermissionsKeys.length) })}
        </p>
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={selectAllPermissions}
        >
          {allSelectedGlobally ? t("buttons:deselect_all") : t("buttons:select_all")}
        </Button>
      </div>

      <Table columns={columns}>
        {Object.entries(permissions).map(([key, section]) => {
          const sectionChildren = section?.children || {};
          const childKeys = Object.keys(sectionChildren);

          const allSelectedInCategory =
            childKeys.length > 0 &&
            childKeys.every((permKey) =>
              selectedPermissions.includes(permKey)
            );

          return (
            <TRow key={key}>
              <TData isMain column={columns[0]}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <Switch
                      label={section.label}
                      checked={allSelectedInCategory}
                      onChange={() => selectAllInCategory(key)}
                    />
                  </div>
                </div>
              </TData>

              <TData column={columns[1]}>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(sectionChildren).map(
                    ([permKey, permLabel]) => (
                      <div
                        key={permKey}
                        className="w-fit h-fit cursor-pointer"
                      >
                        <StatusBadge
                          size="small"
                          variant={
                            selectedPermissions.includes(permKey)
                              ? "success"
                              : "error"
                          }
                          onClick={() => togglePermission(permKey)}
                        >
                          {permLabel}
                        </StatusBadge>
                      </div>
                    )
                  )}
                </div>
              </TData>
            </TRow>
          );
        })}
      </Table>

      <div className="mt-5">
        <Button
          isLoading={isGrantingPermissions}
          type="button"
          variant="secondary"
          onClick={handleSubmit}
        >
          {isGrantingPermissions
            ? t("buttons:isLoading")
            : t("account:buttons.grant_permissions")}
        </Button>
      </div>
    </div>
  );
};

export default GrantPermissionsSection;