// admin/acceptance/constants/acceptance.constants.ts

export const ACCEPTANCE_CONSTANTS = {
  PIPELINE: {
    CHUNK_SIZE: 500,
  },
  SEGMENTS: {
    MALE_NEW: 'male-new',
    MALE_RETURNING: 'male-returning',
    FEMALE_NEW: 'female-new',
    FEMALE_RETURNING: 'female-returning',
  },
  RECOMMENDATIONS: {
    ACCEPTED: 'مقبول',
    REVIEW: 'مراجعة',
    REJECTED: 'مرفوض',
  },
  ENROLLMENT: {
    AFFILIATED: 'منتسب',                                                      
  },
  GRADE_SCORES: {
    '4': 4,
    '3': 3,
    '2': 2,
    '1': 1,
    '0': 0,
  },
  EXPORT: {
    EXCEL_FILE_NAMES: {
      'male-new': 'قائمة_الطلاب_الجدد_ذكور_المرحلة',
      'male-returning': 'قائمة_الطلاب_القدامى_ذكور_المرحلة',
      'female-new': 'قائمة_الطلاب_الجدد_إناث_المرحلة',
      'female-returning': 'قائمة_الطلاب_القدامى_إناث_المرحلة',
    },
    SECURITY_FILE_NAMES: {
      'male-new': 'الاستعلام_الامني_الطلاب_الجدد_ذكور_المرحلة',
      'male-returning': 'الاستعلام_الامني_الطلاب_القدامى_ذكور_المرحلة',
      'female-new': 'الاستعلام_الامني_الطلاب_الجدد_إناث_المرحلة',
      'female-returning': 'الاستعلام_الامني_الطلاب_القدامى_إناث_المرحلة',
    },
  },
  EXCEL: {
    TRANSLATIONS: {
      RECOMMENDATION: {
        accepted: 'قبول',
        review: 'مراجعة',
        rejected: 'رفض',
      },
      GRADES: {
        '4': 'ممتاز',
        '3': 'جيد جداً',
        '2': 'جيد',
        '1': 'مقبول',
        '0': 'راسب',
      },
    },
    VALIDATION: {
      ADMIN_DECISION_DROPDOWN: '"تم القبول؛ يُرجى التوجه إلى (مبنى 3) لاستيفاء المُستندات,عدم مطابقة النطاق الجغرافي,عدم تسوية الموقف المالي,غير مطابق لنظام القيد (انتساب),عدم توافق التبعية للإدارة التعليمية (القاهرة الكبرى),عدم استيفاء الحد الأدنى للتقدير الأكاديمي,مرفوض لوجود عقوبات تأديبية سابقة"',
      STATUS_DROPDOWN: '"مقبول,مرفوض,قيد المراجعة"',
    },
  },
};