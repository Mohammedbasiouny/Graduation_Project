import Heading from "@/components/ui/Heading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, TData, TRow } from "@/components/ui/Table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const PermissionsSection = ({ userPermissions = [] }) => {
  const { t } = useTranslation();

  const rawPermissions = t("permissions:permissions", {
    returnObjects: true,
    defaultValue: {},
  });

  const permissions =
    typeof rawPermissions === "object" ? rawPermissions : {};

  const columns = useMemo(
    () => [
      t('permissions:parent'),
      t('permissions:childrens'),
    ],
    [t]
  );

  return (
      <div className='bg-white rounded-2xl shadow-md p-5 md:p-8 space-y-5 transition'>
        <Heading
          title={t('account:view_permissions_heading.title')}
          subtitle={t('account:view_permissions_heading.subtitle')}
          size="sm"
          align="start"
        />
        <Table columns={columns}>
          {Object.entries(permissions).map(([key, section]) => {
            return (
              <TRow key={key}>
                <TData isMain column={columns[0]}>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="font-medium text-gray-800">
                      {section.label}
                    </span>
                  </div>
                </TData>

                <TData column={columns[1]}>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(section.children || {}).map(
                      ([permKey, permLabel]) => (
                        <div key={permKey} className="w-fit h-fit">
                          <StatusBadge 
                            size="small" 
                            variant={userPermissions.includes(permKey) ? "success" : "error"}
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
    </div>
  );
};

export default PermissionsSection;