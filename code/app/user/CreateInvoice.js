import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import CryptoJS from "crypto-js";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
  ScrollView,
  Button,
  FlatList,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { DataTable } from "react-native-paper";
import tw from "twrnc";
import InvoiceInfo from "../../components/InvoiceInfo";
import PdfGenerator from "../../components/PdfGenerator";
import { RotateCcw, Save } from "lucide-react-native";
import { auth, db } from "../../firebaseConfig";

// import DatePicker from "react-native-date-picker";

const CreateInvoice = (props) => {
  const { width, height } = Dimensions.get("window");

  const edit_data = useLocalSearchParams();

  const [InvName, SetInvName] = useState("");
  const [InvDate, SetInvDate] = useState("");
  const [InvDsc, SetInvDsc] = useState([
    { item: "", quantity: null, amount: null },
  ]);
  const [total, setTotal] = useState(0);
  const [InvNo, SetInvNo] = useState();
  // From
  const [InvFromName, SetInvFromName] = useState("");
  const [InvFromStreet, SetInvFromStreet] = useState("");
  const [InvFromAddress, SetInvFromAddress] = useState("");
  const [InvFromZip, SetInvFromZip] = useState();
  const [InvFromEmail, SetInvFromEmail] = useState("");
  const [InvFromPhone, SetInvFromPhone] = useState("");
  // To
  const [InvToName, SetInvToName] = useState("");
  const [InvToStreet, SetInvToStreet] = useState("");
  const [InvToAddress, SetInvToAddress] = useState("");
  const [InvToZip, SetInvToZip] = useState();
  const [InvToEmail, SetInvToEmail] = useState("");
  const [InvToPhone, SetInvToPhone] = useState("");

  useEffect(() => {
    // console.log("use effect !!");
    if (edit_data !== undefined && edit_data.edit == "true") {
      const data = JSON.parse(edit_data.data);
      SetInvName(data.invoiceName);
      SetInvDate(data.date);
      SetInvDsc(data.description);
      setTotal(data.total);
      SetInvNo(data.invoiceNumber);

      SetInvToName(data.to.name);
      SetInvToStreet(data.to.street);
      SetInvToAddress(data.to.address);
      SetInvToZip(data.to.zip);
      SetInvToEmail(data.to.email);
      SetInvToPhone(data.to.phone);

      SetInvFromName(data.from.name);
      SetInvFromStreet(data.from.street);
      SetInvFromAddress(data.from.address);
      SetInvFromZip(data.from.zip);
      SetInvFromEmail(data.from.email);
      SetInvFromPhone(data.from.phone);
    }
  }, []);

  const empty = () => {
    SetInvName("");
    SetInvDate("");
    SetInvDsc([{ item: "", quantity: null, amount: null }]);
    setTotal(0);
    SetInvNo("");

    SetInvToName("");
    SetInvToStreet("");
    SetInvToAddress("");
    SetInvToZip();
    SetInvToEmail("");
    SetInvToPhone("");

    SetInvFromName("");
    SetInvFromStreet("");
    SetInvFromAddress("");
    SetInvFromZip();
    SetInvFromEmail("");
    SetInvFromPhone("");
  };
  const encryptData = (data) => {
    const secretKey = "secret-key";
    // Convert the data to a string (if it's an object) before encryption
    const dataString = JSON.stringify(data);

    // Encrypt the string data using AES encryption
    const encryptedData = CryptoJS.AES.encrypt(
      dataString,
      secretKey
    ).toString();

    return encryptedData;
  };

  const saveInvoice = () => {
    let myTotal = 0;

    setTotal(0);
    InvDsc.map((item) => {
      if (item.amount != null && item.quantity != null) {
        myTotal += Number(item.quantity) * Number(item.amount);
        setTotal((prev) => {
          // console.log(prev, item.quantity, item.amount);
          const num =
            Number(prev) + Number(item.quantity) * Number(item.amount);

          return num;
        });
      }
    });

    const InvoiceData = {
      invoiceNumber: InvNo,
      invoiceName: InvName,
      date: InvDate,
      total: myTotal,
      owner: auth.currentUser.uid,
      to: {
        name: InvToName,
        street: InvToStreet,
        address: InvToAddress,
        zip: InvToZip,
        email: InvToEmail,
        phone: InvToPhone,
      },
      from: {
        name: InvFromName,
        street: InvFromStreet,
        address: InvFromAddress,
        zip: InvFromZip,
        email: InvFromEmail,
        phone: InvFromPhone,
      },
      description: InvDsc,
      status: "pending",
    };
    // const encryptData = encryptData(InvoiceData);
    if (edit_data && edit_data.edit == "true") {
      const docRef = doc(db, "invoices", edit_data.id);
      setDoc(docRef, InvoiceData)
        .then((docRef) => {
          console.log("Document has been edited successfully");
          Alert.alert("Invoice edited successfully");
        })
        .catch((error) => {
          console.log(error);
          Alert.alert("UnSuccessful");
        });
    } else {
      const collectionRef = collection(db, "invoices");
      addDoc(collectionRef, InvoiceData)
        .then((docRef) => {
          console.log("Document has been added successfully");
          Alert.alert("Invoice saved successfully");
        })
        .catch((error) => {
          console.log(error);
          Alert.alert("UnSuccessful");
        });
    }
  };

  const reset = () => {
    console.log("reset");
    if (edit_data) {
      edit_data = null;
    }
    Alert.alert("Are You Sure", "Are you sure you want to remove", [
      {
        text: "Yes",
        onPress: () => {
          empty();
        },
      },

      {
        text: "No",
      },
    ]);
  };

  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
    <ScrollView>
      <View style={tw`h-full w-full bg-white p-4`}>
        <View style={tw`w-full border-2`}>
          <View style={tw`flex items-center justify-center w-full border-b-2`}>
            <TextInput
              style={tw`  text-3xl font-bold text-center w-full `}
              placeholder="INVOICE"
              value={InvName}
              onChangeText={(input) => SetInvName(input)}
            />
          </View>
          <View style={tw`w-full p-2`}>
            <View style={tw` relative w-full flex flex-row justify-between `}>
              <View
                style={tw` box-border w-[50%] flex flex-row my-2 items-center `}
              >
                <Text style={tw`text-lg  `}>Invoice No : </Text>
                <TextInput
                  style={tw`w-[29%]  p-1`}
                  value={InvNo}
                  onChangeText={(input) => {
                    SetInvNo(input);
                  }}
                ></TextInput>
              </View>
              <View style={tw`box-border w-[50%] flex flex-row my-2`}>
                <Text style={tw`text-lg `}>Date : </Text>
                <TextInput
                  style={tw`w-25  p-1`}
                  value={InvDate}
                  onChangeText={(input) => SetInvDate(input)}
                />
                {/* <DatePicker mode="date" /> */}
              </View>
            </View>

            <View
              style={tw`w-full flex ${
                width >= 650 ? `flex-row justify-between` : `flex-col`
              }`}
            >
              <View style={tw`${width >= 650 ? `w-1/2 px-4` : `w-full`}`}>
                <Text
                  style={tw`my-4 text-xl font-bold w-full border-b-2 border-blue-700`}
                >
                  BILL TO :
                </Text>
                <View style={tw`bg-blue-50 rounded-md p-3`}>
                  <View style={tw`flex flex-row my-1`}>
                    <Text style={tw` text-lg`}>Name : </Text>
                    <TextInput
                      style={tw`text-lg w-[80%]`}
                      value={InvToName}
                      onChangeText={(input) => SetInvToName(input)}
                    />
                  </View>
                  <View style={tw`flex flex-col my-1`}>
                    <Text style={tw`  mb-2 text-lg`}>Address : </Text>
                    <View style={tw`pl-3`}>
                      <TextInput
                        style={tw`  text-lg`}
                        placeholderStyle={tw`text-red-600`}
                        placeholder="Street Adress"
                        value={InvToStreet}
                        onChangeText={(input) => SetInvToStreet(input)}
                      />
                      <TextInput
                        style={tw` text-lg`}
                        placeholder="City, State"
                        value={InvToAddress}
                        onChangeText={(input) => SetInvToAddress(input)}
                      />
                      <TextInput
                        style={tw`  text-lg`}
                        placeholder="Zip"
                        value={InvToZip}
                        onChangeText={(input) => SetInvToZip(input)}
                      />
                    </View>
                  </View>
                  <View>
                    <View style={tw`flex flex-row my-1`}>
                      <Text style={tw` text-lg`}>Phone : </Text>
                      <TextInput
                        style={tw` text-lg w-[80%]`}
                        value={InvToPhone}
                        onChangeText={(input) => SetInvToPhone(input)}
                      />
                    </View>
                    <View style={tw`flex flex-row my-1`}>
                      <Text style={tw` text-lg`}>Email : </Text>
                      <TextInput
                        style={tw` text-lg w-[80%]`}
                        value={InvToEmail}
                        onChangeText={(input) => SetInvToEmail(input)}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View style={tw`${width >= 650 ? `w-1/2 px-4` : `w-full`}`}>
                <Text
                  style={tw`my-4 text-xl font-bold w-full border-b-2 border-blue-700`}
                >
                  FROM :
                </Text>
                <View style={tw`bg-blue-50 rounded-md p-3`}>
                  <View style={tw`flex flex-row my-1`}>
                    <Text style={tw` text-lg`}>Name : </Text>
                    <TextInput
                      style={tw`w-[80%]`}
                      value={InvFromName}
                      onChangeText={(input) => SetInvFromName(input)}
                    />
                  </View>
                  <View style={tw` flex flex-col my-1`}>
                    <Text style={tw`  mb-2 text-lg`}>Address : </Text>
                    <View style={tw`pl-3`}>
                      <TextInput
                        style={tw`  text-lg`}
                        placeholderStyle={tw`text-red-600`}
                        placeholder="Street Adress"
                        value={InvFromStreet}
                        onChangeText={(input) => SetInvFromStreet(input)}
                      />
                      <TextInput
                        style={tw` text-lg`}
                        placeholder="City, State"
                        value={InvFromAddress}
                        onChangeText={(input) => SetInvFromAddress(input)}
                      />
                      <TextInput
                        style={tw`  text-lg`}
                        placeholder="Zip"
                        value={InvFromZip}
                        onChangeText={(input) => SetInvFromZip(input)}
                      />
                    </View>
                  </View>
                  <View>
                    <View style={tw`flex flex-row my-1`}>
                      <Text style={tw` text-lg`}>Phone : </Text>
                      <TextInput
                        style={tw` text-lg w-[80%]`}
                        value={InvFromPhone}
                        onChangeText={(input) => SetInvFromPhone(input)}
                      />
                    </View>
                    <View style={tw`flex flex-row my-1`}>
                      <Text style={tw` text-lg`}>Email : </Text>
                      <TextInput
                        style={tw` text-lg w-[80%]`}
                        value={InvFromEmail}
                        onChangeText={(input) => SetInvFromEmail(input)}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
            {/* DESCRIPTION TABLE START*/}
            <View>
              <Text
                style={tw`my-4 text-xl font-bold w-full border-b-2 border-blue-700`}
              >
                Description
              </Text>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title style={tw`flex-2`}>
                    <Text style={tw`font-semibold text-lg `}>Item</Text>
                  </DataTable.Title>
                  <DataTable.Title numeric style={tw`flex-2`}>
                    <Text style={tw`font-semibold text-lg `}>Quantity</Text>
                  </DataTable.Title>
                  <DataTable.Title numeric style={tw`flex-2`}>
                    <Text style={tw`font-semibold text-lg `}>Amount</Text>
                  </DataTable.Title>
                  <DataTable.Title
                    numeric
                    style={tw`flex-1 `}
                  ></DataTable.Title>
                </DataTable.Header>
                <FlatList
                  data={InvDsc}
                  renderItem={({ item, index }) => {
                    return (
                      <DataTable.Row key={index}>
                        <View style={tw`flex-2  w-full`}>
                          <View
                            style={tw`flex-1 w-full items-center justify-center`}
                          >
                            <TextInput
                              style={tw`w-full `}
                              value={item.item}
                              onChangeText={(text) => {
                                SetInvDsc((prev) => {
                                  let newarr = [...prev];
                                  newarr[index].item = text;
                                  return newarr;
                                });
                              }}
                            />
                          </View>
                        </View>

                        <View style={tw`flex-2 w-full `}>
                          <View style={tw`flex-1 items-center justify-center`}>
                            <TextInput
                              style={tw`w-full text-center `}
                              value={item.quantity}
                              onChangeText={(text) => {
                                SetInvDsc((prev) => {
                                  let newarr = [...prev];
                                  newarr[index].quantity = text;
                                  return newarr;
                                });
                              }}
                            />
                          </View>
                        </View>
                        <View style={tw`flex-2`}>
                          <View
                            style={tw`flex-1 w-full items-center justify-center`}
                          >
                            <TextInput
                              style={tw`w-full text-center`}
                              value={item.amount}
                              onChangeText={(text) => {
                                SetInvDsc((prev) => {
                                  let newarr = [...prev];
                                  newarr[index].amount = text;
                                  return newarr;
                                });
                              }}
                            />
                          </View>
                        </View>
                        <View style={tw`flex-1 justify-center items-end`}>
                          <TouchableOpacity
                            onPress={() => {
                              SetInvDsc((prev) => {
                                let newarr = [...prev];
                                newarr.splice(index, 1);
                                return newarr;
                              });
                            }}
                          >
                            <Text
                              style={tw` p-2 text-center rounded-full bg-red-700 text-white `}
                            >
                              X
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </DataTable.Row>
                    );
                  }}
                />
              </DataTable>
              <Text
                style={tw`my-2 text-xl font-bold w-full border-b-2 border-blue-700`}
              ></Text>
              {/* <View> */}
              <View
                style={tw`mx-auto flex flex-row justify-between w-[50%] mb-3 `}
              >
                <Text style={tw`text-xl font-semibold`}>Total</Text>

                <Text style={tw`text-xl font-semibold`}>₹ {total}</Text>
              </View>
              {/* </View> */}
              <Button
                title="add"
                onPress={() => {
                  SetInvDsc((prev) => {
                    let newarr = [...prev];
                    newarr.push({ item: "", quantity: null, amount: null });
                    console.log(newarr);
                    return newarr;
                  });
                }}
              ></Button>
            </View>
            {/* DESCRIPTION TABLE END */}
          </View>
        </View>
        <View style={tw`flex flex-row justify-between px-4 py-3`}>
          <TouchableOpacity
            style={tw`shadow-md rounded-md flex flex-row  items-center justify-center px-4 py-2 bg-[#3F94EF]`}
            onPress={() => saveInvoice()}
          >
            <Save color="white" />
            <Text style={tw`text-white px-1`}>Save</Text>
          </TouchableOpacity>
          {/* <PdfGenerator></PdfGenerator> */}
          <TouchableOpacity
            style={tw`shadow-md rounded-md flex flex-row  items-center justify-center px-4 py-2 bg-[#3F94EF]`}
            onPress={() => reset()}
          >
            <RotateCcw color="white" />
            <Text style={tw`text-white px-1`}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    //   <StatusBar style="auto" />
    // </SafeAreaView>
  );
};

export default CreateInvoice;
