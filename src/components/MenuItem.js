import React from 'react';
import {Text, View, TouchableHighlight} from 'react-native';

import tailwind from 'tailwind-rn';

const MenuItem = props => {
  const {text, children} = props;

  return (
    <View
      style={tailwind(
        'bg-white p-4 border-gray-200 border-t border-b h-20 flex-row items-center',
      )}>
      {children}
      <Text style={tailwind('text-gray-800 font-semibold ml-3')}>{text}</Text>
    </View>
  );
};

export default MenuItem;
