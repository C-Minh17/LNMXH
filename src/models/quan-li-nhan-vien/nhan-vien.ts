import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<MNhanVien.IRecord>('nhan-vien');

  return {
    ...objInit,
  };
};
