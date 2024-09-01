import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation, useNavigationState } from "@react-navigation/native";

import tailwind from "twrnc";
import { Home, BusFront, Ticket, User2Icon } from "lucide-react-native";
// import {  } from "react";
// import Dashboard from "../screens/Dashboard";

const Menu = () => {
  console.log(curr_route);
  const navigation = useNavigation();
  const [selected_color, setColor] = useState("Dashboard");

  //   const route = useRoute();
  //   console.log(route.name);

  useEffect(() => {
    () => {
      const curr_route = state.routes[state.routes.length - 1].name;
    };
  }, [state?.routes.length]);

  return (
    <View
      style={tailwind` flex flex-row items-center border-t-[1px] pt-2 h-full bg-[#FFFFFF] w-full`}
    >
      <TouchableOpacity
        style={tailwind`w-[25%] flex flex-col items-center justify-center`}
        onPress={() => {
          setColor("Dashboard");
          navigation.navigate("Dashboard");
        }}
      >
        <Home
          color={selected_color === "Dashboard" ? "red" : "gray"}
          size={28}
        />
        <Text style={tailwind`text-xs`}>Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tailwind`w-[25%] flex flex-col  items-center justify-center`}
        onPress={() => {
          setColor("Track Bus");
          navigation.navigate("Track Bus");
        }}
      >
        <BusFront
          color={selected_color === "Track Bus" ? "red" : "gray"}
          size={28}
        />
        <Text style={tailwind`text-xs`}>Track</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tailwind`w-[25%] flex flex-col items-center justify-center`}
        onPress={() => {
          setColor("Show Ticket");
          navigation.navigate("Show Ticket");
        }}
      >
        <Ticket
          color={selected_color === "Show Ticket" ? "red" : "gray"}
          size={28}
        />
        <Text style={tailwind`text-xs`}>Show Ticket</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tailwind`w-[25%] flex flex-col  items-center justify-center`}
        onPress={() => {
          setColor("Login");
          navigation.navigate("Login");
        }}
      >
        <User2Icon
          color={selected_color === "Login" ? "red" : "gray"}
          size={28}
        />
        <Text style={tailwind`text-xs`}>Log In</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={tailwind`w-[20%] flex items-center justify-center`}
        onPress={() => {
          setColor("Signup");
          navigation.navigate("Signup");
        }}
      >
        <Text style={tailwind`text-xs`}>Sign Up</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default Menu;
