import {View, Text} from 'react-native';
import {useRef, useEffect} from 'react';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import tw from 'twrnc';
import {GOOGLEMAPS_API_KEY} from '@env';
import React from 'react';

const RideMap = ({rideData}) => {
  const mapRef = useRef(null);

  useEffect(() => {
    console.log(rideData);
  }, [rideData]);

  const origin = rideData?.source;
  const destination = rideData?.destination;

  useEffect(() => {
    if (!origin || !destination) return;
    //Zoom and fit to markers
    mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
      edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
    });
    setTimeout(() => {
      mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
        edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
      });
    }, 500);
  }, [origin, destination]);

  return (
    <MapView
      ref={mapRef}
      style={tw`flex-1`}
      region={{
        latitude: rideData?.sourceLat ? rideData?.sourceLat : 0,
        longitude: rideData?.sourceLng ? rideData?.sourceLng : 0,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}>
      <Marker
        coordinate={{
          latitude: rideData?.sourceLat ? rideData?.sourceLat : 0,
          longitude: rideData?.sourceLng ? rideData?.sourceLng : 0,
        }}
        title={'Origin'}
        description={rideData?.source}
        identifier="origin"
      />
      <Marker
        coordinate={{
          latitude: rideData?.destinationLat ? rideData?.destinationLat : 0,
          longitude: rideData?.destinationLng ? rideData?.destinationLng : 0,
        }}
        title={'Destination'}
        description={rideData?.destination}
        identifier="destination"
      />
      <MapViewDirections
        origin={{
          latitude: rideData?.sourceLat ? rideData?.sourceLat : 0,
          longitude: rideData?.sourceLng ? rideData?.sourceLng : 0,
        }}
        destination={{
          latitude: rideData?.destinationLat ? rideData?.destinationLat : 0,
          longitude: rideData?.destinationLng ? rideData?.destinationLng : 0,
        }}
        apikey={GOOGLEMAPS_API_KEY}
        strokeWidth={3}
        strokeColor="black"
      />
    </MapView>
  );
};

export default RideMap;
