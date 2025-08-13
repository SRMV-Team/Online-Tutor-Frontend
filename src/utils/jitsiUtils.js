// Generate unique room name for Jitsi
export const generateRoomName = (subject, className, teacherId) => {
  const timestamp = Date.now();
  const sanitizedSubject = subject.replace(/\s+/g, '').toLowerCase();
  return `${sanitizedSubject}-${className}-${teacherId}-${timestamp}`;
};

// Open Jitsi meeting in new tab (for teachers)
export const openJitsiInNewTab = (roomName, displayName, subject, className) => {
  try {
    const jitsiUrl = `https://meet.jit.si/${roomName}#config.startWithAudioMuted=false&config.startWithVideoMuted=false&userInfo.displayName="${encodeURIComponent(displayName)}"`;
    
    // Store meeting info for reference
    localStorage.setItem(`meeting_${roomName}`, JSON.stringify({
      roomName,
      displayName,
      subject,
      className,
      startTime: new Date().toISOString(),
      role: 'teacher'
    }));
    
    const newWindow = window.open(jitsiUrl, '_blank', 'width=1200,height=800');
    
    if (!newWindow) {
      alert('Please allow popups to start the meeting');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error opening Jitsi meeting:', error);
    return false;
  }
};

// Join Jitsi meeting in same tab (for students)
export const joinJitsiMeeting = (roomName, displayName) => {
  try {
    const jitsiUrl = `https://meet.jit.si/${roomName}#config.startWithAudioMuted=true&config.startWithVideoMuted=true&userInfo.displayName="${encodeURIComponent(displayName)}"`;
    
    // Store meeting info for reference
    localStorage.setItem(`meeting_${roomName}`, JSON.stringify({
      roomName,
      displayName,
      startTime: new Date().toISOString(),
      role: 'student'
    }));
    
    // Redirect to Jitsi meeting
    window.location.href = jitsiUrl;
    
    return true;
  } catch (error) {
    console.error('Error joining Jitsi meeting:', error);
    return false;
  }
};

// Get meeting info from localStorage
export const getMeetingInfo = (roomName) => {
  try {
    const meetingData = localStorage.getItem(`meeting_${roomName}`);
    return meetingData ? JSON.parse(meetingData) : null;
  } catch (error) {
    console.error('Error getting meeting info:', error);
    return null;
  }
};

// Clean up meeting data
export const cleanupMeetingData = (roomName) => {
  try {
    localStorage.removeItem(`meeting_${roomName}`);
  } catch (error) {
    console.error('Error cleaning up meeting data:', error);
  }
};
