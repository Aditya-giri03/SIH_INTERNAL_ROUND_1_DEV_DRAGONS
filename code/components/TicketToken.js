import { View, Text, Touchable } from 'react-native';
import React, { useState } from 'react';
import tailwind from 'twrnc';
import { TouchableOpacity } from 'react-native';
import PdfGenerator from './PdfGenerator';
import { FileEdit, Ban, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { db } from '../firebaseConfig';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { useUser } from '../app/_layout';

const TicketToken = (props) => {
  // const navigation = useNavigation(); //---> changing this to expo router
  const router = useRouter();
  const data = props.data;
  // const name = getUserById(props.data.owner);
  const { userRole: role } = useUser();
  // const role = 'user';
  const invoiceId = props.id;

  console.log(data);
  console.log(props.id);
  const [invStatus, setInvStatus] = useState(data.status);

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleColor = (status) => {
    if (status == 'approved') return `green-500`;
    if (status == 'pending') return `orange-400`;
    else return `red-500`;
  };

  const updateInvoiceStatus = async (newStatus) => {
    try {
      const invoicesRef = collection(db, 'invoices');
      const invoiceRef = doc(invoicesRef, invoiceId);

      await updateDoc(invoiceRef, {
        status: newStatus,
      });

      setInvStatus(newStatus);
      console.log(`Invoice ${invoiceId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating invoice status: ', error);
    }
  };

  return (
    <View style={tailwind` shadow-xl rounded-lg  m-4`}>
      <View
        style={tailwind`flex flex-row rounded-md justify-center items-center px-2 py-1 bg-[#ACF35C]`}
      >
        <Text style={tailwind`text-xl font-bold text-black`}>
          {capitalize(data.invoiceName)}
        </Text>
      </View>
      <View
        style={tailwind`px-3 py-3 bg-white  w-full flex flex-col justify-between`}
      >
        <View style={tailwind`w-full flex flex-row justify-between mb-2`}>
          <View style={tailwind`pb-4`}>
            <Text style={tailwind`font-bold text-xl text-black`}>
              Invoice No: {data.invoiceNumber}
            </Text>
          </View>
          <View style={tailwind`pb-4 flex flex-row`}>
            <Text style={tailwind`font-bold text-xl text-black`}>Status: </Text>
            <Text
              style={tailwind`font-bold text-xl text-${handleColor(invStatus)}`}
            >
              {capitalize(invStatus)}
            </Text>
          </View>
        </View>

        <View style={tailwind`w-full flex flex-row justify-between mb-2`}>
          <View style={tailwind`flex flex-col justify-center items-center`}>
            <Text style={tailwind`text-base`}>Innvoice Date</Text>
            <Text style={tailwind`text-lg font-semibold`}>{data.date}</Text>
          </View>
          <View style={tailwind`flex flex-col justify-center items-center`}>
            <Text style={tailwind`text-base`}>Total Amount</Text>
            <Text style={tailwind`text-lg font-semibold`}>₹ {data.total}</Text>
          </View>
        </View>
        <View style={tailwind`w-full flex flex-row justify-between`}>
          {role === 'user' ? (
            <>
              <PdfGenerator items={data} />
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: '/user/CreateInvoice',
                    params: {
                      id: props.id,
                      data: JSON.stringify(data),
                      edit: true,
                    },
                  });
                }}
                style={tailwind`shadow-md rounded-md flex flex-row  items-center justify-center px-4 py-2 bg-[#3F94EF]`}
              >
                <FileEdit color="white" />
                <Text style={tailwind`text-white px-1`}>Edit</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => {
                  updateInvoiceStatus('approved');
                }}
                style={tailwind`shadow-md rounded-md flex flex-row  items-center justify-center px-4 py-2 bg-green-500`}
              >
                <Check color="white" />
                <Text style={tailwind`text-white px-1`}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  updateInvoiceStatus('rejected');
                }}
                style={tailwind`shadow-md rounded-md flex flex-row  items-center justify-center px-4 py-2 bg-red-500`}
              >
                <Ban color="white" />
                <Text style={tailwind`text-white px-1`}>Reject</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        {role === 'officer' && (
          <View style={tailwind`pt-5`}>
            <PdfGenerator items={data} />
          </View>
        )}
      </View>
    </View>
  );
};

export default TicketToken;
