import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client.js';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [t, s] = await Promise.all([api.list(), api.stats()]);
      setTasks(t);
      setStats(s);
      setError(null);
    } catch (e) {
      setError(e.message || 'Could not reach the ledger service.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createTask = useCallback(
    async (payload) => {
      const created = await api.create(payload);
      setTasks((prev) => [...prev, created]);
      refresh();
      return created;
    },
    [refresh]
  );

  const updateTask = useCallback(
    async (id, payload) => {
      const updated = await api.update(id, payload);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      refresh();
      return updated;
    },
    [refresh]
  );

  const toggleTask = useCallback(
    async (id) => {
      // optimistic flip
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
      try {
        await api.toggle(id);
        refresh();
      } catch (e) {
        refresh();
      }
    },
    [refresh]
  );

  const archiveTask = useCallback(
    async (id) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      await api.archive(id);
      refresh();
    },
    [refresh]
  );

  const deleteTask = useCallback(
    async (id) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      await api.remove(id);
      refresh();
    },
    [refresh]
  );

  const reorderTasks = useCallback(
    async (orderedIds) => {
      setTasks((prev) => {
        const map = new Map(prev.map((t) => [t.id, t]));
        return orderedIds.map((id) => map.get(id)).filter(Boolean);
      });
      await api.reorder(orderedIds);
    },
    []
  );

  return {
    tasks,
    stats,
    loading,
    error,
    refresh,
    createTask,
    updateTask,
    toggleTask,
    archiveTask,
    deleteTask,
    reorderTasks,
  };
}
