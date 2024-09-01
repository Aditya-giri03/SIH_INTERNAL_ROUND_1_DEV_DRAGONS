import React, { useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { db } from '../../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import TicketToken from '../../components/TicketToken';
import tailwind from 'twrnc';

const Approvals = () => {
  const [inv_data, setInv_data] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const invoicesRef = collection(db, 'invoices');
  const q = query(invoicesRef, where('1', '==', '1'));
  let invoices;
  useFocusEffect(
    React.useCallback(() => {
      const fun = async () => {
        console.log('yes');
        setLoading(true);
        invoices = await getDocs(invoicesRef);
        console.log(invoices.docs);
        setInv_data(() => {
          return invoices.docs;
        });
        setLoading(false);
      };
      fun();
    }, [])
  );

  if (isLoading) {
    return (
      <View style={tailwind`flex-1 justify-center items-center h-full w-full`}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={tailwind` h-full w-full bg-white`}>
      <FlatList
        style={tailwind`pb-3`}
        data={inv_data}
        renderItem={({ item }) => (
          <TicketToken data={item.data()} id={item.id} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Approvals;
