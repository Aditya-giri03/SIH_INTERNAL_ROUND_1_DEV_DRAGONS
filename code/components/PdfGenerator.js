import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import { Button } from "react-native";
import tailwind from "twrnc";
import { Share } from "lucide-react-native";
const PdfGenerator = (props) => {
  const [isLoading, setLoading] = useState(false);
  const data = props.items;
  const desc = props.items.description;
  const html = `
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <style>
    *{
      padding: 0;
      margin: 0;
      box-sizing: border-box;
    }
    h2{
      padding: 10px 5px;
    }
    h3{
      padding: 10px 5px;
    }
    .dataText{
      font-size: 1.1rem;
      margin-left: 5px;
    }
    
  </style>

<body>
<div style="border: solid 2px black; width:100%; padding: 50px 10px;">

  <div style="display:flex; flex-direction:row;justify-content: center; text-align:center;width:100%;"> 
  <h1 style="margin:20px 0;  font-size: 3rem;">${data?.invoiceName}</h1>
  </div>

  <div style="display:flex; flex-direction:row; justify-content:space-between; width:100%;">
    <div style="display:flex; flex-direction:row; align-items: center;">
      <h2>Invoice Number: </h2><p class="dataText">${data.invoiceNumber}<p>
    </div>
    <div style="display:flex; flex-direction:row; align-items: center;">
      <h2>Date: </h2> <span class="dataText">${data.invoiceNumber}</span>
    </div>
  </div>
  

  <div style="display:flex; flex-direction:row; width:100%; justify-content: space-between; margin: 20px 0;">

    <div style="background-color: #b9ff90; padding: 20px 5px; border-radius: 10px; width: 45%;">
      <h2 style="border-bottom: 5px solid green; margin-bottom: 20px;">Invoice To:</h2>
    
      <div style="display:flex; flex-direction:row;  align-items: center;">
        <h3>Name: </h3> <span class="dataText">${data?.to.name}</span>
      </div>

      <h3>Address: </h3>  

  
      <div style="display:flex; flex-direction:row;  align-items: center;">
        <h3>Street: </h3> <span class="dataText">${data?.to.street}</span>
      </div>

      <div style="display:flex; flex-direction:row; align-items: center;">
        <h3>Address: </h3> <span class="dataText">${data?.to.address}</span>
      </div>

      <div style="display:flex; flex-direction:row; align-items: center;">
        <h3>Zip: </h3> <span class="dataText">${data?.to.zip}</span>
      </div>
      <div style="display:flex; flex-direction:row; align-items: center;">
        <h3>Phone: </h3> <span class="dataText">${data?.to.phome}</span>
      </div>
      <div style="display:flex; flex-direction:row; align-items: center;">
        <h3>Email: </h3> <span class="dataText">${data?.to.email}</span>
      </div>

    </div>

    <div style="background-color: #b9ff90; padding: 20px 5px; border-radius: 10px; width: 45%;">
      <h2 style="border-bottom: 5px solid green; margin-bottom: 20px;">Invoice From:</h2>
    
      <div style="display:flex; flex-direction:row;  align-items: center;">
        <h3>Name: </h3> <span class="dataText">${data?.from.name}</span>
      </div>

      <h3>Address: </h3>  

  
      <div style="display:flex; flex-direction:row;  align-items: center;">
        <h3>Street: </h3> <span class="dataText">${data?.from.street}</span>
      </div>

      <div style="display:flex; flex-direction:row; align-items: center;">
        <h3>Address: </h3> <span class="dataText">${data?.from.address}</span>
      </div>

      <div style="display:flex; flex-direction:row; align-items: center;">
        <h3>Zip: </h3> <span class="dataText">${data?.from.zip}</span>
      </div>
      <div style="display:flex; flex-direction:row; align-items: center;">
        <h3>Phone: </h3> <span class="dataText">${data?.from.phome}</span>
      </div>
      <div style="display:flex; flex-direction:row; align-items: center;">
        <h3>Email: </h3> <span class="dataText">${data?.from.email}</span>
      </div>

    </div>

  </div>
  
  <h2 style="border-bottom: 5px solid blue;">Description:</h2>

  <div style="display:flex; flex-direction:column; text-align:center; width:100%;">
    <div style="display:flex; flex-direction:row; justify-content:space-evenly; text-align:center; width:100%;"> 
      <h3>Item</h3>
      <h3>Quantity</h3>
      <h3>Amount</h3>
    </div> 
    <hr>

    ${desc.map((ele) => {
      return `<div style="display:flex; flex-direction:row; justify-content:space-evenly; text-align:center; width:100%; border-bottom: 2px solid #808080;">
      <p >${ele.item}</p>
      <p>${ele.quantity}</p>
      <p>${ele.amount}</p>
      </div>`;
    })}

    <div tyle="display:flex; flex-direction:row;justify-content:space-evenly; text-align:center; width:100px;">
    <div><h3>Total: </h3></div>
    <div><p class="dataText">${data.total}</p></div>
    </div>

  </div>
</div>
<body>
</html>
  `;

  const generatePDF = async () => {
    setLoading(true);
    const file = await printToFileAsync({
      html: html,
      base64: false,
    });
    await shareAsync(file.uri);
    setLoading(false);
  };

  if (isLoading) {
    return (
      <View style={tailwind`flex-1 justify-center items-center h-full w-full`}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <View>
      <TouchableOpacity
        onPress={() => generatePDF()}
        style={tailwind`shadow-md rounded-md flex flex-row  items-center justify-center px-4 py-2 bg-[#3F94EF]`}
      >
        <Share color="white" />
        <Text style={tailwind`text-white px-1`}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PdfGenerator;
