import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'photos';

export default function CalendarScreen() {
  const [marked, setMarked] = useState({});

  useEffect(() => {
    const load = async () => {
      const raw = await AsyncStorage.getItem(KEY);
      const list = raw ? JSON.parse(raw) : [];

      const marks = {};
      list.forEach(p => {
        const day = p.date.split('T')[0]; // yyyy-mm-dd
        marks[day] = { marked: true, dotColor: 'blue' };
      });

      setMarked(marks);
    };
    load();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Calendar
        markedDates={marked}
        theme={{
          selectedDayBackgroundColor: '#0a84ff',
          todayTextColor: '#da09cf',
          arrowColor: '#0a84ff',
        }}
      />
    </View>
  );
}
