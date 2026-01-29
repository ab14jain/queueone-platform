// Language translations
export const translations = {
  en: {
    // General
    queueone: "QueueOne",
    home: "Home",
    language: "Language",
    font: "Font",
    
    // Queue Page
    checkToken: "Check Your Token",
    enterMobileToFind: "Enter your mobile number to find your token status",
    getYourToken: "Get Your Token",
    patientName: "Patient name (optional)",
    mobileNumber: "Mobile number (optional)",
    generateToken: "Generate Token",
    registering: "Registering...",
    yourToken: "Your Token",
    statusWaiting: "⏳ Your Position",
    statusServing: "✓ YOUR TURN!",
    statusServed: "✓ Completed",
    yourTurn: "YOUR TURN!",
    proceedToCounter: "📋 Please proceed to the counter",
    peopleAhead: "People ahead",
    estimatedWait: "Est. wait",
    nowServing: "Now Serving",
    waiting: "Waiting",
    tokenNotFound: "Token not found",
    
    // Lookup Page
    lookupQueueId: "Queue ID (e.g., q_abc12345)",
    lookupMobile: "Mobile number (e.g., 8965879654)",
    searching: "Searching...",
    findMyToken: "Find My Token",
    
    // Display Screen
    nowServingDisplay: "Now Serving",
    
    // Admin
    adminDashboard: "Admin Dashboard",
    queueManagement: "QueueOne Management",
    enrollDoctor: "📝 Enroll Doctor",
    queueControl: "🎮 Queue Control",
    
    // Doctor Enrollment
    doctorDetails: "Doctor Details",
    doctorName: "Doctor name",
    email: "Email",
    phone: "Phone",
    locationDetails: "Location Details",
    locationName: "Location name",
    address: "Address",
    type: "Type",
    queueSettings: "Queue Settings",
    queueName: "Queue name",
    tokenPrefix: "Token prefix",
    createQueue: "Create Queue",
    queueCreated: "Queue Created Successfully",
    queueId: "Queue ID",
    
    // Queue Control
    lookupQueue: "Lookup Queue",
    callNext: "Call Next",
    skip: "Skip",
    closeQueue: "Close Queue",
    openQueue: "Open Queue",
    
    // Errors
    error: "Error",
    success: "Success",
    tryAgain: "Try Again",
    noTokensWaiting: "No tokens waiting",
  },
  hi: {
    // General
    queueone: "क्यूऑन",
    home: "होम",
    language: "भाषा",
    font: "फॉन्ट",
    
    // Queue Page
    checkToken: "अपना टोकन चेक करें",
    enterMobileToFind: "अपना टोकन स्टेटस जानने के लिए मोबाइल नंबर दर्ज करें",
    getYourToken: "अपना टोकन पाएं",
    patientName: "मरीज का नाम (वैकल्पिक)",
    mobileNumber: "मोबाइल नंबर (वैकल्पिक)",
    generateToken: "टोकन बनाएं",
    registering: "पंजीकरण हो रहा है...",
    yourToken: "आपका टोकन",
    statusWaiting: "⏳ आपकी बारी",
    statusServing: "✓ आपकी बारी है!",
    statusServed: "✓ पूर्ण",
    yourTurn: "आपकी बारी है!",
    proceedToCounter: "📋 कृपया काउंटर पर जाएं",
    peopleAhead: "सामने लोग",
    estimatedWait: "अनुमानित प्रतीक्षा",
    nowServing: "अभी सेवा दी जा रही है",
    waiting: "प्रतीक्षा कर रहे हैं",
    tokenNotFound: "टोकन नहीं मिला",
    
    // Lookup Page
    lookupQueueId: "क्यू आईडी (जैसे q_abc12345)",
    lookupMobile: "मोबाइल नंबर (जैसे 8965879654)",
    searching: "खोज रहे हैं...",
    findMyToken: "मेरा टोकन खोजें",
    
    // Display Screen
    nowServingDisplay: "अभी सेवा दी जा रही है",
    
    // Admin
    adminDashboard: "प्रशासक डैशबोर्ड",
    queueManagement: "क्यूऑन प्रबंधन",
    enrollDoctor: "📝 डॉक्टर नामांकन",
    queueControl: "🎮 क्यू नियंत्रण",
    
    // Doctor Enrollment
    doctorDetails: "डॉक्टर का विवरण",
    doctorName: "डॉक्टर का नाम",
    email: "ईमेल",
    phone: "फोन",
    locationDetails: "स्थान विवरण",
    locationName: "स्थान का नाम",
    address: "पता",
    type: "प्रकार",
    queueSettings: "क्यू सेटिंग्स",
    queueName: "क्यू का नाम",
    tokenPrefix: "टोकन उपसर्ग",
    createQueue: "क्यू बनाएं",
    queueCreated: "क्यू सफलतापूर्वक बनाया गया",
    queueId: "क्यू आईडी",
    
    // Queue Control
    lookupQueue: "क्यू खोजें",
    callNext: "अगला कॉल करें",
    skip: "छोड़ें",
    closeQueue: "क्यू बंद करें",
    openQueue: "क्यू खोलें",
    
    // Errors
    error: "त्रुटि",
    success: "सफलता",
    tryAgain: "फिर से प्रयास करें",
    noTokensWaiting: "कोई टोकन प्रतीक्षा में नहीं है",
  },
};

export type Language = "en" | "hi";

export const getTranslation = (lang: Language, key: keyof typeof translations.en): string => {
  return (translations[lang] as any)[key] || (translations.en as any)[key];
};

// Text-to-speech function
export const speak = (text: string, language: Language = "en") => {
  if (!("speechSynthesis" in window)) {
    console.log("Speech synthesis not supported");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === "hi" ? "hi-IN" : "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
};
