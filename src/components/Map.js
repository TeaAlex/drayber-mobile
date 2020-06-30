import React, {useEffect, useState, useContext} from 'react'
import MapView, {PROVIDER_GOOGLE, Polyline, Marker} from "react-native-maps";
import {View, StyleSheet, Text, TouchableHighlight, TouchableOpacity, Button} from "react-native";
import tailwind from "tailwind-rn";
import RNLocation from 'react-native-location';
import polyline from "@mapbox/polyline"
import {SearchContext} from "../context/SearchContext";
import {API_URL, GOOGLE_API_KEY} from 'react-native-dotenv'
import MenuToggle from "../assets/icons/menu-toggle.svg";
import SocketIOClient from "socket.io-client";
import {UserContext} from "../context/UserContext";



const styles = StyleSheet.create({
  input: {
    ...tailwind('text-gray-700 font-bold p-4 bg-white w-2/3 rounded absolute text-center'),
    top: "-10%"
  }
})

const Map = ({navigation}) => {

  const {from, to, setFrom, setTo, tripInfo, setTripInfo} = useContext(SearchContext);
  const [position, setPosition] = useState({});
  const [coordinates, setCoordinates] = useState([]);
  const [encodedPolyline, setEncodedPolyline] = useState("}uvhHoiyNr@JNiBVqETiCPoAp@uDLyAL{C@wBOaDBC@IAEd@YfAc@?WIYMSOi@S}HGsDJeJN}IN{BXqBZwBHu@D_@Dy@DI@QEKGEMaDOmJEoC?_ABo@Hm@N_@FAJIHONeA`@mAJi@Fs@?y@KwAOu@Oc@s@qAa@s@eAmBIWu@mAkAmBo@kACS?Q@c@Ee@ISKOOIOCQDMFKNIRGl@Ff@FPBl@Gt@@fAIz@IRKPMHo@PmDk@sEs@iMoB_OaCeDm@mCq@cDgAqD{AOU_@WsE}CsGcF{J_HuU_Pu@{AOg@Ok@Kw@Ge@Me@aA}BKYOUKg@AYDMDYCc@GUOUOKSAIDMTQp@a@`ASt@OlAU|@k@~BSx@_@hBIp@Mj@Kv@CBIFEJIZA`@w@`CsBdISfAExAIBMTCZ@NUv@o@jCcBvHq@pCUj@IJ[V]L]?YCOGW[S_@yBcGi@_B@E?KEWMOKCMBORCXDXLPPBLAJLd@jA^rAn@dBj@~AJPLHHAHOf@kC");
  const [response, setResponse] = useState({
    "geocoded_waypoints": [
      {
        "geocoder_status": "OK",
        "place_id": "ChIJNy4cwyUP5kcRCQKtBmWXUyI",
        "types": [
          "street_address"
        ]
      },
      {
        "geocoder_status": "OK",
        "place_id": "ChIJw5UPJXcP5kcR8tWwMUA0SkU",
        "types": [
          "establishment",
          "point_of_interest",
          "train_station",
          "transit_station"
        ]
      }
    ],
    "routes": [
      {
        "bounds": {
          "northeast": {
            "lat": 48.80813939999999,
            "lng": 2.6290664
          },
          "southwest": {
            "lat": 48.7796599,
            "lng": 2.5923375
          }
        },
        "copyrights": "Map data ©2020",
        "legs": [
          {
            "distance": {
              "text": "6.4 km",
              "value": 6434
            },
            "duration": {
              "text": "11 mins",
              "value": 638
            },
            "end_address": "Gare d'Émerainville Pontault - Combault, Rue de la Famille Auribault, 77184 Émerainville, France",
            "end_location": {
              "lat": 48.80657679999999,
              "lng": 2.6183213
            },
            "start_address": "44 Rue des Longs Prés, 77340 Pontault-Combault, France",
            "start_location": {
              "lat": 48.7819064,
              "lng": 2.5923993
            },
            "steps": [
              {
                "distance": {
                  "text": "28 m",
                  "value": 28
                },
                "duration": {
                  "text": "1 min",
                  "value": 7
                },
                "end_location": {
                  "lat": 48.7816549,
                  "lng": 2.5923375
                },
                "html_instructions": "Head <b>south</b> on <b>Rue des Longs Prés</b> toward <b>Rue de la Pompe</b><div style=\"font-size:0.9em\">Restricted usage road</div>",
                "polyline": {
                  "points": "}uvhHoiyNh@HH@"
                },
                "start_location": {
                  "lat": 48.7819064,
                  "lng": 2.5923993
                },
                "travel_mode": "DRIVING"
              },
              {
                "distance": {
                  "text": "0.5 km",
                  "value": 469
                },
                "duration": {
                  "text": "2 mins",
                  "value": 93
                },
                "end_location": {
                  "lat": 48.78092729999999,
                  "lng": 2.5985555
                },
                "html_instructions": "Turn <b>left</b> onto <b>Rue de la Pompe</b><div style=\"font-size:0.9em\">Restricted usage road</div>",
                "maneuver": "turn-left",
                "polyline": {
                  "points": "itvhHciyNLaB@GBi@RgDNiBD_@BMLaAVuAX_B@CBYBUBe@JcC@WByAA]?QEu@EkACM"
                },
                "start_location": {
                  "lat": 48.7816549,
                  "lng": 2.5923375
                },
                "travel_mode": "DRIVING"
              },
              {
                "distance": {
                  "text": "61 m",
                  "value": 61
                },
                "duration": {
                  "text": "1 min",
                  "value": 8
                },
                "end_location": {
                  "lat": 48.7804785,
                  "lng": 2.598901
                },
                "html_instructions": "At the roundabout, take the <b>1st</b> exit onto <b>Rue Lucien Brunet</b>",
                "maneuver": "roundabout-right",
                "polyline": {
                  "points": "yovhH_pzN@?@A?A@A?A?C?A?CAALKVMn@U"
                },
                "start_location": {
                  "lat": 48.78092729999999,
                  "lng": 2.5985555
                },
                "travel_mode": "DRIVING"
              },
              {
                "distance": {
                  "text": "1.0 km",
                  "value": 1042
                },
                "duration": {
                  "text": "2 mins",
                  "value": 147
                },
                "end_location": {
                  "lat": 48.7801602,
                  "lng": 2.6126061
                },
                "html_instructions": "Turn <b>left</b> onto <b>Route de la Libération</b><div style=\"font-size:0.9em\">Go through 1 roundabout</div>",
                "maneuver": "turn-left",
                "polyline": {
                  "points": "_mvhHcrzNVM?Q?EAGAEAECECEIMCKK]ASMaFAm@AYCaAAm@A}@?E@gAF}C?I@uBBeA?KDuDDuAJ{AB_@@GViBDUTaBFa@@SBK@SBy@@?@?@C?A@C@A?C?E?EAECECCCAC_@Eq@Aq@A]Cu@?QE_DEeCCoAAY?a@?C?]?I?O?G@[@SBUDWFQFM"
                },
                "start_location": {
                  "lat": 48.7804785,
                  "lng": 2.598901
                },
                "travel_mode": "DRIVING"
              },
              {
                "distance": {
                  "text": "0.5 km",
                  "value": 495
                },
                "duration": {
                  "text": "1 min",
                  "value": 49
                },
                "end_location": {
                  "lat": 48.7816311,
                  "lng": 2.6179509
                },
                "html_instructions": "At the roundabout, take the <b>1st</b> exit onto <b>D21</b>",
                "maneuver": "roundabout-right",
                "polyline": {
                  "points": "_kvhHyg}NB?BA@ABA@ABC@CBC@C@C@C?E@E?C@GBQ@KBKFWFMHUFQDSDUBYBY?Y?]?ACS?KC_@CWGYG[IYEIGMOYYe@ACCECGAAGKCEEIEE?AOUGMCCKUCES_@?AEGGSACIMk@_AKOMSEKk@}@Yg@CGIOGKCK?GAI"
                },
                "start_location": {
                  "lat": 48.7801602,
                  "lng": 2.6126061
                },
                "travel_mode": "DRIVING"
              },
              {
                "distance": {
                  "text": "0.3 km",
                  "value": 286
                },
                "duration": {
                  "text": "1 min",
                  "value": 28
                },
                "end_location": {
                  "lat": 48.7826163,
                  "lng": 2.6163505
                },
                "html_instructions": "At the roundabout, take the <b>3rd</b> exit onto the <b>N104</b> ramp to <b>Marne-la-Vallée</b>",
                "maneuver": "roundabout-right",
                "polyline": {
                  "points": "etvhHei~N@G@I?G?I?G?IAG?GCKCIEIEIEEGEGCGAGAG@IBE@GDEFEFEHCHCJAL?HAH@H?H@HBHBFBHB`@?JAJ?JAJCP?P?N?R@PAP?LCLCLCHEHEJEDEBGDKBc@L"
                },
                "start_location": {
                  "lat": 48.7816311,
                  "lng": 2.6179509
                },
                "travel_mode": "DRIVING"
              },
              {
                "distance": {
                  "text": "1.1 km",
                  "value": 1139
                },
                "duration": {
                  "text": "1 min",
                  "value": 48
                },
                "end_location": {
                  "lat": 48.792654,
                  "lng": 2.619343
                },
                "html_instructions": "Merge onto <b>N104</b>/<wbr/><b>N4</b>",
                "maneuver": "merge",
                "polyline": {
                  "points": "kzvhHe_~NeAQc@Gc@I_@GaCa@e@G]GMA}@O}@OsAS{@OsASg@I}@MC?EAu@MqAS}@MqAUqASsAU{@OsASg@K_@KIA_@IGC}@Sg@Ou@Uy@Yo@UCAYKe@S_A_@q@["
                },
                "start_location": {
                  "lat": 48.7826163,
                  "lng": 2.6163505
                },
                "travel_mode": "DRIVING"
              },
              {
                "distance": {
                  "text": "0.3 km",
                  "value": 337
                },
                "duration": {
                  "text": "1 min",
                  "value": 16
                },
                "end_location": {
                  "lat": 48.7953308,
                  "lng": 2.6214998
                },
                "html_instructions": "Take exit <b>14</b> toward <b>Pontault-Ct-Gare</b>/<wbr/><b>Roissy en B.-Centre</b>/<wbr/><b>Parcs d'Activités-Des Arpents</b>/<wbr/><b>Parcs d'Activités-De Pontillault</b>",
                "maneuver": "ramp-right",
                "polyline": {
                  "points": "ayxhH{q~NOU_@WkAw@gCeBg@a@kFaE"
                },
                "start_location": {
                  "lat": 48.792654,
                  "lng": 2.619343
                },
                "travel_mode": "DRIVING"
              },
              {
                "distance": {
                  "text": "0.7 km",
                  "value": 687
                },
                "duration": {
                  "text": "1 min",
                  "value": 32
                },
                "end_location": {
                  "lat": 48.8008645,
                  "lng": 2.6256558
                },
                "html_instructions": "Keep <b>left</b> to continue on <b>Exit 15</b>, follow signs for <b>De Pontillault</b>",
                "maneuver": "keep-left",
                "polyline": {
                  "points": "yiyhHk__OgEyCsDeCqLcIcH{E"
                },
                "start_location": {
                  "lat": 48.7953308,
                  "lng": 2.6214998
                },
                "travel_mode": "DRIVING"
              },
              {
                "distance": {
                  "text": "0.2 km",
                  "value": 240
                },
                "duration": {
                  "text": "1 min",
                  "value": 20
                },
                "end_location": {
                  "lat": 48.8020107,
                  "lng": 2.6283838
                },
                "html_instructions": "Keep <b>right</b> at the fork, follow signs for <b>D361</b>/<wbr/><b>Pontault-Ct-Gare</b>/<wbr/><b>Roissy en B.-Centre</b>/<wbr/><b>Parc d'Activités</b>/<wbr/><b>Des Arpents</b>",
                "maneuver": "fork-right",
                "polyline": {
                  "points": "klzhHky_Ou@{AOg@Ok@Kw@CSCQGUEOm@yASc@EM?ACCAECCEECEAECECKAGAMCU"
                },
                "start_location": {
                  "lat": 48.8008645,
                  "lng": 2.6256558
                },
                "travel_mode": "DRIVING"
              },
              {
                "distance": {
                  "text": "0.4 km",
                  "value": 400
                },
                "duration": {
                  "text": "1 min",
                  "value": 40
                },
                "end_location": {
                  "lat": 48.8035883,
                  "lng": 2.6251661
                },
                "html_instructions": "At the roundabout, take the <b>3rd</b> exit onto <b>Boulevard de la Malibran</b>/<wbr/><b>D361</b><div style=\"font-size:0.9em\">Continue to follow D361</div>",
                "maneuver": "roundabout-right",
                "polyline": {
                  "points": "qszhHkj`O@CBE@GBG@G?A?G?I?GAGAIAGAGAAACCGEECEAAAAECCCCAEAC?E?C?C@EBC@IREJCJCLCJKPUn@KZGXARMx@I\\K^]vA?@GPER?@A@Mj@CHQt@Mr@CLEb@GREVKv@"
                },
                "start_location": {
                  "lat": 48.8020107,
                  "lng": 2.6283838
                },
                "travel_mode": "DRIVING"
              },
              {
                "distance": {
                  "text": "0.3 km",
                  "value": 294
                },
                "duration": {
                  "text": "1 min",
                  "value": 32
                },
                "end_location": {
                  "lat": 48.8047376,
                  "lng": 2.621652
                },
                "html_instructions": "At the roundabout, take the <b>1st</b> exit onto <b>Rue de l'Est</b>/<wbr/><b>D361</b>",
                "maneuver": "roundabout-right",
                "polyline": {
                  "points": "m}zhHiv_OCBEBCBCDADCDAFADAFAF?F?F?Hm@fBIXOb@cB`HA@Ot@AJ?BAJ?P?VCb@"
                },
                "start_location": {
                  "lat": 48.8035883,
                  "lng": 2.6251661
                },
                "travel_mode": "DRIVING"
              },
              {
                "distance": {
                  "text": "88 m",
                  "value": 88
                },
                "duration": {
                  "text": "1 min",
                  "value": 11
                },
                "end_location": {
                  "lat": 48.8051061,
                  "lng": 2.620666
                },
                "html_instructions": "At the roundabout, take the <b>1st</b> exit onto <b>D361</b>",
                "maneuver": "roundabout-right",
                "polyline": {
                  "points": "sd{hHi`_OA?A@C?A@A@A@A@ABA@?@ABAB?@AB?BAB?@?B?B?B?B?B@B?BETA@GNENIVGXGR"
                },
                "start_location": {
                  "lat": 48.8047376,
                  "lng": 2.621652
                },
                "travel_mode": "DRIVING"
              },
              {
                "distance": {
                  "text": "0.5 km",
                  "value": 511
                },
                "duration": {
                  "text": "1 min",
                  "value": 46
                },
                "end_location": {
                  "lat": 48.807815,
                  "lng": 2.6197
                },
                "html_instructions": "Keep <b>left</b> to continue on <b>Tunnel de Pontault-Combault/<wbr/>Emerainville</b>",
                "maneuver": "keep-left",
                "polyline": {
                  "points": "}f{hHez~NI`@?@CHGVOl@GXGVGX[vAMh@CRMf@Op@a@~AEPOXA@GHKJOJMFODK@QAUACAMEAAIGEIAAEGGKGMAAACGSUk@ISSk@O]Sm@Sm@EI]eAKY"
                },
                "start_location": {
                  "lat": 48.8051061,
                  "lng": 2.620666
                },
                "travel_mode": "DRIVING"
              },
              {
                "distance": {
                  "text": "0.1 km",
                  "value": 145
                },
                "duration": {
                  "text": "1 min",
                  "value": 23
                },
                "end_location": {
                  "lat": 48.8076269,
                  "lng": 2.619085
                },
                "html_instructions": "At the roundabout, take the <b>4th</b> exit",
                "maneuver": "roundabout-right",
                "polyline": {
                  "points": "{w{hHct~N@A?C?C?A?C?A?C?A?CAA?C?AAAAC?AAAAAACAAAAA?AAA??AA?A?A?A??AA?A??@A?A?A?A?A@A?A@C@A@AB?@A@A@AB?@AB?B?@AB?B?@?B?B?@?B@B?@@B?B@@?B@@@@@B@@@@@?@@@@@?@@@?@?B?@?@?@?@ABAD@@?@BBDBB`@~@BJ"
                },
                "start_location": {
                  "lat": 48.807815,
                  "lng": 2.6197
                },
                "travel_mode": "DRIVING"
              },
              {
                "distance": {
                  "text": "0.2 km",
                  "value": 212
                },
                "duration": {
                  "text": "1 min",
                  "value": 38
                },
                "end_location": {
                  "lat": 48.80657679999999,
                  "lng": 2.6183213
                },
                "html_instructions": "Slight <b>right</b><div style=\"font-size:0.9em\">Destination will be on the right</div>",
                "maneuver": "turn-slight-right",
                "polyline": {
                  "points": "uv{hHgp~N^rAn@dB^dAJXFJBDDFF@B?DABEBC@E@CH[XcB@G"
                },
                "start_location": {
                  "lat": 48.8076269,
                  "lng": 2.619085
                },
                "travel_mode": "DRIVING"
              }
            ],
            "traffic_speed_entry": [],
            "via_waypoint": []
          }
        ],
        "overview_polyline": {
          "points": "}uvhHoiyNr@JNiBVqETiCPoAp@uDLyAL{C@wBOaDBC@IAEd@YfAc@?WIYMSOi@S}HGsDJeJN}IN{BXqBZwBHu@D_@Dy@DI@QEKGEMaDOmJEoC?_ABo@Hm@N_@FAJIHONeA`@mAJi@Fs@?y@KwAOu@Oc@s@qAa@s@eAmBIWu@mAkAmBo@kACS?Q@c@Ee@ISKOOIOCQDMFKNIRGl@Ff@FPBl@Gt@@fAIz@IRKPMHo@PmDk@sEs@iMoB_OaCeDm@mCq@cDgAqD{AOU_@WsE}CsGcF{J_HuU_Pu@{AOg@Ok@Kw@Ge@Me@aA}BKYOUKg@AYDMDYCc@GUOUOKSAIDMTQp@a@`ASt@OlAU|@k@~BSx@_@hBIp@Mj@Kv@CBIFEJIZA`@w@`CsBdISfAExAIBMTCZ@NUv@o@jCcBvHq@pCUj@IJ[V]L]?YCOGW[S_@yBcGi@_B@E?KEWMOKCMBORCXDXLPPBLAJLd@jA^rAn@dBj@~AJPLHHAHOf@kC"
        },
        "summary": "N104/N4",
        "warnings": [],
        "waypoint_order": []
      }
    ],
    "status": "OK"
  });
  const {user} = useContext(UserContext);
  const socket = SocketIOClient(API_URL);

  useEffect(() => {
    const getPosition = async () => {
      RNLocation.configure({
        distanceFilter: 100
      })
      const granted = await RNLocation.requestPermission({
        ios: "whenInUse",
        android: {
          detail: "coarse"
        }
      })
      if (granted) {
        const unsubscribe = RNLocation.subscribeToLocationUpdates(locations => {
          const {latitude, longitude} = locations[0];
          if (latitude && longitude) {
            setPosition({ latitude, longitude });
            unsubscribe();
            // console.log(latitude, longitude);
            // console.log(position)
            // console.log('unsub')
          }
        });
      }
    }
    const setTrip = () => {
      const points = polyline.decode(encodedPolyline);
      const coords = points.map(point => {
        return {
          latitude: point[0],
          longitude: point[1]
        }
      });
      const leg = response.routes[0].legs[0];
      setFrom(leg.start_address)
      setTo(leg.end_address)
      setTripInfo({
        distance: leg.distance.text,
        duration: leg.duration.text,
        price: parseInt(leg.distance.text) * 2,
        startAddress: {
          name: leg.start_address,
          coords: {
            latitude: leg.start_location.lat,
            longitude: leg.start_location.lng
          }
        },
        endAddress: {
          name: leg.end_address,
          coords: {
            latitude: leg.end_location.lat,
            longitude: leg.end_location.lng
          }
        },
        coords
      })
    }
    // getPosition();
    setTrip();
  }, []);

  const onPress = () => {
    const {startAddress, endAddress} = tripInfo;
    socket.emit('press', {
      startAddress,
      endAddress
    });
    alert('looking for a driver !');
  }

  const [showOffer, setShowOffer] = useState(false);
  const [drivers, setDrivers] = useState([]);
  socket.on('new-offer', data => {
    console.log('new offer', data);
    if (user.id === data[0]) {
      console.log('in user');
      setShowOffer(true);
      setDrivers(data);
    }
  });

  const accept = () => {
    console.log('accept');
  }

  const decline = () => {
    drivers.shift();
    socket.emit('decline-offer', drivers);
  }


  return (
    <>
      {
        Object.keys(tripInfo).length > 0 ?
          <View style={tailwind('flex-1 bg-white items-center justify-center')}>
            <TouchableOpacity
              style={{position: 'absolute', top: 40, left: 20, zIndex: 100}}
              onPress={() => navigation.navigate('Menu')}
            >
              <MenuToggle />
            </TouchableOpacity>
            <MapView
              style={tailwind('h-full w-full')}
              provider={PROVIDER_GOOGLE}
              region={{
                latitude: tripInfo.startAddress.coords.latitude,
                longitude: tripInfo.startAddress.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              loadingEnabled={true}
            >
              {
                tripInfo && tripInfo.coords && tripInfo.coords.length > 0 &&
                <Polyline
                  coordinates={tripInfo.coords}
                  strokeColor="#434190"
                  strokeWidth={3}
                />
              }
            </MapView>
            {
              tripInfo && tripInfo.coords && tripInfo.coords.length > 0 &&
              <View style={{...tailwind('bg-gray-100 w-full absolute bottom-0'), height: "48%"}}>
                {
                  showOffer && <View><Button title={"OUI"} onPress={accept}/><Button title={"NON"} onPress={decline}/></View>
                }
                <Text style={tailwind('text-indigo-800 font-bold text-lg text-center py-6')}>Récapitulatif de la course</Text>
                <View>
                  <View style={tailwind('bg-white p-4')}>
                    <Text style={tailwind('text-gray-700 font-bold')}>Départ</Text>
                    <Text style={tailwind('text-gray-600 text-sm')}>{from}</Text>
                  </View>
                  <View style={tailwind('bg-white p-4')}>
                    <Text style={tailwind('text-gray-700 font-bold')}>Arrivé</Text>
                    <Text style={tailwind('text-gray-600 text-sm')}>{to}</Text>
                  </View>
                </View>
                <View style={tailwind('flex flex-row justify-center items-center my-6')}>
                  <Text style={tailwind('text-center text-indigo-800 font-bold text-lg')}>{tripInfo.distance} · {tripInfo.duration} · {tripInfo.price} €</Text>
                </View>
                <View style={tailwind('flex flex-row justify-center items-center')}>
                  <TouchableHighlight style={{...tailwind('bg-indigo-800 p-4 rounded')}} onPress={onPress}>
                    <Text style={tailwind('text-white font-bold text-center text-lg')}> Rechercher un chauffeur </Text>
                  </TouchableHighlight>
                </View>
              </View>
            }
          </View>
          : <Text>Loading</Text>
      }
    </>
  )
}

export default Map
