import { View, Text } from "react-native";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";
import { formatRupiah } from "../lib/utils";

export const BalanceCard = ({ summary }) => {
  console.log(summary);
  return (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceTitle}>Total Saldo</Text>
      <Text style={styles.balanceAmount}>Rp.{formatRupiah(summary.saldo)}</Text>
      <View style={styles.balanceStats}>
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>Pemasukkan</Text>
          <Text style={[styles.balanceStatAmount, { color: COLORS.income }]}>
            +Rp.{formatRupiah(summary.pemasukkan)}
          </Text>
        </View>
        <View style={[styles.balanceStatItem, styles.statDivider]} />
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>Pengeluaran</Text>
          <Text style={[styles.balanceStatAmount, { color: COLORS.expense }]}>
            Rp.{formatRupiah(summary.pengeluaran)}
          </Text>
        </View>
      </View>
    </View>
  );
};
