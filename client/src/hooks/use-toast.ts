// Simple toast hook
export function useToast() {
  return {
    toast: ({ title, description, variant }: { title: string; description?: string; variant?: 'default' | 'destructive' }) => {
      if (variant === 'destructive') {
        alert(`❌ ${title}\n${description || ''}`);
      } else {
        alert(`✅ ${title}\n${description || ''}`);
      }
    },
  };
}

