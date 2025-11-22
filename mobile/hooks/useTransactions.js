// react custom hook file

import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api";

export const useTransactions = (userId) => {
  const [transaction, setTransaction] = useState();
  const [sumary, setSumary] = useState({
    saldo: 0,
    pemasukkan: 0,
    pengeluaran: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // useCallback is used for performance reason, it will memoize the function
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await response.json();
      setTransaction(data);
    } catch (error) {
      console.log("Error fetching transactions", error);
    }
  }, [userId]);

  const fetchSumary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
      const data = await response.json();
      setSumary(data);
    } catch (error) {
      console.log("Error fetching sumary", error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // can be run in parallel
      await Promise.all([fetchTransactions(), fetchSumary()]);
    } catch (error) {
      console.log("Error loading data", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSumary, userId]);

  const deleteTransaction = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete transaction");
      //   refresh data after deletion
      loadData();
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (error) {
      console.log("Error deleting transaction", error);
      Alert.alert("Error", error.message);
    }
  });

  console.log(" HASIL : ", sumary);
  console.log(" HASIL : ", transaction);
  return { transaction, sumary, isLoading, deleteTransaction, loadData };
};
