// importing navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// importing constants
import Colors from './constants/Colors'; 

// importing icons
import { Ionicons } from '@expo/vector-icons';

// importing react hooks
import { useState } from 'react';


// importing screens 
import Splash from './screens/Splash';
import OnBoarding1 from './screens/OnBoarding1';
import OnBoarding2 from './screens/OnBoarding2';
import OnBoarding3 from './screens/OnBoarding3';
import PrivacyTerms1 from './screens/PrivacyTerms1';
import Start from './screens/Start';
import Login from './screens/Login';

// importing components
import BackButton from './components/UI/BackButton';


// creating stack navigator
const Stack = createNativeStackNavigator();

// creating stack navigator function
function StackNavigator() {
  // setting progress bar steps
  const [step, setStep] = useState(1);

  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: Colors.MainColor}, // Correct usage
        headerShadowVisible: false, // Remove shadow between content and header
        headerStyle: { 
          shadowOpacity: 0, // Remove shadow on iOS
          elevation: 0 // Remove shadow on Android
        },
        headerStyle: { 
          backgroundColor: Colors.SeconderyColor,
        },
        headerTitle: "",
      }}>
      <Stack.Screen name="Splash" component={Splash} options={{ 
        headerShown: false, 
        gestureEnabled: false // Disable going back to Splash
      }} />
      <Stack.Screen name="OnBoarding1">
        {props => <OnBoarding1 {...props} step={step} setStep={setStep} />}
      </Stack.Screen>
      <Stack.Screen name="OnBoarding2">
        {props => <OnBoarding2 {...props} step={step} setStep={setStep} />}
      </Stack.Screen>
      <Stack.Screen name="OnBoarding3">
        {props => <OnBoarding3 {...props} step={step} setStep={setStep} />}
      </Stack.Screen>
      <Stack.Screen name="Start" component={Start} 
       options={{
        headerShown: true,
        headerLeft: () => <BackButton />,
        
      }}/>
      <Stack.Screen name="PrivacyTerms1" component={PrivacyTerms1} options={{
        headerShown: true,
        headerLeft: () => <BackButton />,
        
      }} />
      <Stack.Screen name="Login" component={Login} options={{
        headerShown: true,
        headerLeft: () => <BackButton />,
        
      }}/>
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}