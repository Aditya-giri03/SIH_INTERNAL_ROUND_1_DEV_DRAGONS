import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { PieChart } from 'react-native-chart-kit';
import { Feather } from '@expo/vector-icons';

const Dashboard = () => {
  const { width, height } = Dimensions.get('window');
  const [billStats, setBillStats] = useState([
    {
      name: 'Pending',
      count: 0,
      color: 'rgba(131, 167, 234, 1)',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Approved',
      count: 0,
      color: '#F00',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Rejected',
      count: 0,
      color: 'red',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetchBillStats();
  // }, []);

  const [pendingAmt, setPendingAmt] = useState(0);
  const [approvedAmt, setApprovedAmt] = useState(0);
  const [rejectedAmt, setRejectedAmt] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const fetchBillStats = async () => {
        try {
          const billsRef = collection(db, 'invoices');
          const querySnapshot = await getDocs(billsRef);

          let pending = 0,
            approved = 0,
            rejected = 0;

          setPendingAmt(0);
          setApprovedAmt(0);
          setRejectedAmt(0);

          querySnapshot.forEach((doc) => {
            const bill = doc.data();

            if (bill.status) {
              console.log(bill);
              switch (bill.status) {
                case 'pending':
                  pending++;
                  setPendingAmt((prev) => {
                    console.log(typeof prev);
                    return Number(prev) + Number(bill.total);
                  });
                  break;
                case 'approved':
                  approved++;
                  setApprovedAmt((prev) => {
                    return Number(prev) + Number(bill.total);
                  });
                  break;
                case 'rejected':
                  rejected++;
                  setRejectedAmt((prev) => {
                    return Number(prev) + Number(bill.total);
                  });
                  break;
              }
            }
          });
          console.log(pendingAmt, approvedAmt, rejectedAmt);

          setBillStats([
            {
              name: 'Pending',
              count: pending,
              color: 'orange',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
            {
              name: 'Approved',
              count: approved,
              color: '#70f56c',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
            {
              name: 'Rejected',
              count: rejected,
              color: '#f74a36',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
          ]);

          // console.log('Bill stats:', billStats);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching bill stats:', error);
          setLoading(false);
        }
      };
      fetchBillStats();
    }, [])
  );

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.chart}>
          <Text style={styles.title}>Bill Statistics</Text>

          {/* {console.log('Bill stats:', billStats)} */}
          <PieChart
            data={billStats}
            width={width}
            height={230}
            chartConfig={chartConfig}
            accessor={'count'}
            backgroundColor={'transparent'}
            paddingLeft={'15'}
            center={[10, 1]}
            absolute
          />
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statsLabel}>Pending Bills:</Text>
            <Text style={styles.statsAmount}>₹ {pendingAmt}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statsLabel}>Approved Bills:</Text>
            <Text style={styles.statsAmount}>₹ {approvedAmt}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statsLabel}>Rejected Bills:</Text>
            <Text style={styles.statsAmount}>₹ {rejectedAmt}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => auth.signOut()}
      >
        <Feather name="log-out" size={20} color="#fff" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  chart: {
    width: '100%',

    alignItems: 'center',
    justifyContent: 'flex-start',

    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statsContainer: {
    width: '100%',
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statsAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF474D',
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default Dashboard;
