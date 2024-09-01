import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import tailwind from "twrnc";
import { collection, query, where, doc, getDocs } from "firebase/firestore";
import { BarChart } from "react-native-chart-kit";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../../firebaseConfig";
import { Feather } from "@expo/vector-icons";

const Dashboard = () => {
  const [isLoading, setLoading] = useState(false);
  const Mon_lable = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const year_lable = [2020, 2021, 2022, 2023, 2024];
  const { width, height } = Dimensions.get("window");
  const [per, setPer] = useState();
  const [inv_data, setInv_data] = useState([]);
  const [type, setType] = useState("");
  const [lables, setLables] = useState(Mon_lable);
  const [chart_data, setChart_data] = useState([]);
  const [total, setTotal] = useState();
  // const auth = getAuth();
  // const db = getFirestore();

  const invoicesRef = collection(db, "invoices");
  const q = query(invoicesRef, where("owner", "==", auth.currentUser.uid));
  let invoices;

  useFocusEffect(
    React.useCallback(() => {
      const fun = async () => {
        setLoading(true);
        invoices = await getDocs(q);
        setInv_data((prev) => {
          prev = [...invoices.docs];
          console.log(prev);
          return prev;
        });
        setLoading(false);
      };
      fun();
    }, [])
  );

  let month_data = Array(12).fill(0);
  let year_data = Array(5).fill(0);
  let total_sales_month = 0;
  let total_sales_year = 0;
  let total_sales = 0;

  for (let i = 0; i < inv_data.length; i++) {
    let data = inv_data[i].data();
    let current_year = new Date().getFullYear();

    let d_date = data.date.split("/");
    let m = parseInt(d_date[1]);
    let y = parseInt(d_date[2]) - current_year;

    if (y == 0) {
      month_data[m - 1] += data.total;
      total_sales_month += data.total;
    }
    if (y + 4 >= 0) {
      year_data[y + 4] += data.total;
      total_sales_year += data.total;
    }
    total_sales += data.total;
  }

  const barData = {
    labels: lables,
    datasets: [
      {
        data: chart_data,
      },
    ],
  };
  const chartConfig = {
    useShadowColorFromDataset: false,
    fillShadowGradient: "skyblue",
    // backgroundColor: "#ACF35C ",
    fillShadowGradientOpacity: 1,

    backgroundGradientFrom: "#ACF35C",
    // backgroundGradientFromOpacity: 0.1,
    backgroundGradientTo: "#00ED6B",
    // backgroundGradientToOpacity: 0.1,
    color: (opacity = 0.5) => `rgba(18, 3, 46, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  if (isLoading) {
    return (
      <View style={tailwind`flex-1 justify-center items-center h-full w-full`}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <ScrollView style={tailwind`flex-1 h-full w-full bg-white`}>
      <View style={tailwind`flex-1 h-full w-full items-center`}>
        <View
          style={tailwind`w-full flex flex-row justify-evenly bg-[#00ED6B] p-2`}
        >
          <View>
            <Text style={tailwind`text-lg`}>Expenses</Text>
            <Text style={tailwind`text-2xl`}>₹{total}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setLables(Mon_lable);
              setType("month");
              setChart_data(month_data);
              setTotal(total_sales_month);
            }}
            style={tailwind`items-center justify-center h-[40px]  ${
              type === "month" ? `bg-white` : `bg-[#00ED6B]`
            }  w-[25] border-2 rounded-lg border-black`}
          >
            <Text>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setLables(year_lable);
              setType("year");
              setChart_data(year_data);
              setTotal(total_sales_year);
            }}
            style={tailwind`items-center justify-center h-[40px] ${
              type === "year" ? `bg-white` : `bg-[#00ED6B]`
            } w-[25%] border-2 rounded-lg border-black`}
          >
            <Text>Yearly</Text>
          </TouchableOpacity>
        </View>
        <BarChart
          // style={graphStyle}
          data={barData}
          width={width}
          height={400}
          yAxisLabel={"₹"}
          chartConfig={chartConfig}
        />
        <View
          style={tailwind`flex flex-col w-[97%] p-2  rounded-lg border-2 m-2 p-4`}
        >
          <View
            style={tailwind`flex flex-row w-full justify-between items-center py-2`}
          >
            <Text style={tailwind`text-md font-semibold`}>SubTotal</Text>
            <Text style={tailwind`text-md font-semibold`}>₹ {total}</Text>
          </View>
          <View
            style={tailwind`w-full flex flex-row w-full justify-evenly items-center py-2`}
          >
            <View style={tailwind` w-[50%]`}>
              <Text style={tailwind`text-md font-semibold `}>TAX</Text>
            </View>
            <View style={tailwind` w-[25%] flex flex-row px-2 items-center`}>
              <TextInput
                style={tailwind`w-full text-right`}
                value={per}
                onChangeText={(input) => {
                  setPer(input);
                }}
              />
              <Text style={tailwind`text-md font-semibold`}>%</Text>
            </View>
            <View
              style={tailwind` flex w-[25%] item-center justify-center px-2`}
            >
              <Text tyle={tailwind`w-full text-right`}>
                ₹ {(per * total) / 100}
              </Text>
            </View>
          </View>
          <View style={tailwind`flex flex-row w-full justify-between py-2`}>
            <Text style={tailwind`text-md font-semibold`}>Total Summary</Text>
            <Text>{total + (per * total) / 100}</Text>
          </View>
        </View>

        <View
          style={tailwind`w-[68%] h-[7px] bg-black rounded-lg m-2 justify-center items-center`}
        >
          <View style={tailwind`w-20% bg-white h-[1px]`}></View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => auth.signOut()}
      >
        <Feather name="log-out" size={20} color="#fff" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: "center",
    padding: 20,
  },
  chart: {
    width: "100%",

    alignItems: "center",
    justifyContent: "flex-start",

    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  statsContainer: {
    width: "100%",
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statsLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  statsAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0066cc",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF474D",
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default Dashboard;
