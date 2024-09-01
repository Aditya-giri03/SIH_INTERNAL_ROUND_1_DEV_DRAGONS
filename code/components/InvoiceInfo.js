import { View, Text, TextInput, Dimensions } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";

const InvoiceInfo = (props) => {
  const [InvName, SetInvName] = useState("");
  const [InvStreet, SetInvStreet] = useState("");
  const [InvAddress, SetInvAddress] = useState("");
  const [InvZip, SetInvZip] = useState();
  const [InvEmail, SetInvEmail] = useState("");
  const [InvPhone, SetInvPhone] = useState("");
  const { width, height } = Dimensions.get("window");
  const getDataSetter = props.getDataSetter;
  useEffect(() => {
    // Only way to use a state for a function, because the setter function
    // can take a callback to set the new value
    getDataSetter(() => {
      return { InvName, InvStreet, InvAddress, InvZip, InvEmail, InvPhone };
    });
  }, []);

  return (
    <View style={tw`${width >= 650 ? `w-1/2 px-4` : `w-full`}`}>
      <Text
        style={tw`my-4 text-xl font-bold w-full border-b-2 border-blue-700`}
      >
        {props.title} :
      </Text>
      <View style={tw`bg-blue-50 rounded-md p-1`}>
        <View style={tw`flex flex-row my-1`}>
          <Text style={tw`font-sans text-lg`}>Name : </Text>
          <TextInput
            value={InvName}
            onChangeText={(input) => SetInvName(input)}
          />
        </View>
        <View style={tw` flex flex-col my-1`}>
          <Text style={tw` font-sans mb-2 text-lg`}>Address : </Text>
          <TextInput
            style={tw` font-sans text-lg`}
            placeholderStyle={tw`text-red-600`}
            placeholder="Street Adress"
            value={InvStreet}
            onChangeText={(input) => SetInvStreet(input)}
          />
          <TextInput
            style={tw`font-sans text-lg`}
            placeholder="City, State"
            value={InvAddress}
            onChangeText={(input) => SetInvAddress(input)}
          />
          <TextInput
            style={tw` font-sans text-lg`}
            placeholder="Zip"
            value={InvZip}
            onChangeText={(input) => SetInvZip(input)}
          />
        </View>
        <View>
          <TextInput
            style={tw`font-sans text-lg`}
            placeholder="Phone"
            value={InvPhone}
            onChangeText={(input) => SetInvPhone(input)}
          />
          <TextInput
            style={tw`font-sans text-lg`}
            placeholder="Email"
            value={InvEmail}
            onChangeText={(input) => SetInvEmail(input)}
          />
        </View>
      </View>
    </View>
  );
};

export default InvoiceInfo;
