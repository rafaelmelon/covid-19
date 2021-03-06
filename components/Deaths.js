import * as React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";

import Colors from "../constants/Colors";
import { getIconColor } from "../utils/helpers";

export default function Deaths({ countryData }) {
  const { deaths, stats } = countryData;

  const chartData = {
    labels: stats.map((stat) =>
      stat.date.replace("2020-", "").replace("-", "/")
    ),
    datasets: [
      {
        data: stats.map((stat) => stat.deaths),
        strokeWidth: 0,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.infoTitle}>Deaths</Text>
        <View>
          <View style={styles.row}>
            <Text style={styles.title}>Total:</Text>
            <Text style={styles.lastMin}>{deaths.total}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>Today:</Text>
            <Text style={styles.last}>{deaths.today}</Text>
            <Ionicons
              color={getIconColor(deaths.iconId, "deaths")}
              name={deaths.iconId}
              size={25}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>Yesterday:</Text>
            <Text style={styles.lastMin}>{deaths.yesterday}</Text>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <LineChart
          data={chartData}
          width={Dimensions.get("window").width - 10}
          height={160}
          withInnerLines={false}
          withOuterLines={false}
          withShadow={false}
          chartConfig={{
            backgroundGradientFrom: Colors.white,
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: Colors.white,
            backgroundGradientToOpacity: 0,
            color: (opacity = 1) => Colors.deaths,
            labelColor: (opacity = 1) => Colors.title,
            decimalPlaces: 0,
          }}
          style={{
            fontFamily:
              "BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif",
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    marginBottom: 40,
  },
  info: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  infoTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.deaths,
    marginRight: 20,
  },
  title: {
    fontSize: 18,
    color: Colors.title,
    marginRight: 10,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 2,
  },
  last: {
    fontSize: 35,
    fontWeight: "bold",
    color: Colors.deaths,
    marginRight: 10,
  },
  lastMin: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.deaths,
    marginRight: 10,
  },
});
