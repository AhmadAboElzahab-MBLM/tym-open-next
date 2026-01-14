import { useSearchParams } from 'next/navigation';

export function useSearchParamsWrapper() {
  const searchParams = useSearchParams();
  return {
    model: searchParams.get('model'),
    force: searchParams.get('force'),
    configure: searchParams.get('configure'),
  };
}