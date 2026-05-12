import { regestrationKeys } from "@/keys/resources/regestration.keys";
import { regestrationService } from "@/services/regestration.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useRegestrationProfile = (params = {}, options = {}) => {
  return useQuery({
    queryKey: regestrationKeys.profile,
    queryFn: () => regestrationService.getRegestration(params),
    ...options,
  });
};

export const useChangePersonalInfo = (isEgyption, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => regestrationService.personalInfo(isEgyption, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: regestrationKeys.profile,
      });
    },
    ...options,
  });
};

export const useChangeResidenceInfo = (isInsideEgypt, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => regestrationService.residenceInfo(isInsideEgypt, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: regestrationKeys.profile,
      });
    },
    ...options,
  });
};

export const useChangePreUniEduInfo = (isCertificateFromEgypt, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => regestrationService.preUniEduInfo(isCertificateFromEgypt, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: regestrationKeys.profile,
      });
    },
    ...options,
  });
};

export const useChangeAcademicInfo = (isNew, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => regestrationService.academicInfo(isNew, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: regestrationKeys.profile,
      });
    },
    ...options,
  });
};

export const useChangeGuardianInfo = (isEgyption, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => regestrationService.guardianInfo(isEgyption, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: regestrationKeys.profile,
      });
    },
    ...options,
  });
};

export const useChangeParentsInfo = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => regestrationService.parentsInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: regestrationKeys.profile,
      });
    },
    ...options,
  });
};

export const useChangeMedicalInfo = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => regestrationService.medicalInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: regestrationKeys.profile,
      });
    },
    ...options,
  });
};

export const useChangeHousingInfo = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => regestrationService.housingInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: regestrationKeys.profile,
      });
    },
    ...options,
  });
};

export const useDeleteProfile = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => regestrationService.deleteRegestration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: regestrationKeys.profile,
      });
    },
    ...options,
  });
};