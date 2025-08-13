
















import React, { useState, useEffect } from 'react';
import '../styles/takeAttendance.css';
 
const dummyAttendance = {
  7: [
    { rollNo: '701', name: 'Ajay', minutes: 50 },
    { rollNo: '702', name: 'Priya', minutes: 30 },
    { rollNo: '703', name: 'Sneha', minutes: 46 },
  ],
  9: [
    { rollNo: '901', name: 'Karan', minutes: 49 },
    { rollNo: '902', name: 'Deepa', minutes: 20 },
    { rollNo: '903', name: 'Rahul', minutes: 60 },
  ],
  10: [
    { rollNo: '1001', name: 'Arjun', minutes: 15 },
    { rollNo: '1002', name: 'Meena', minutes: 55 },
    { rollNo: '1003', name: 'Varsha', minutes: 48 },
  ]
};


const TakeAttendance = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (selectedClass) {
      // This would be replaced by a fetch from backend in real use
      const classData = dummyAttendance[selectedClass] || [];
      setStudents(classData);
    } else {
      setStudents([]);
    }
    setSearchTerm('');
  }, [selectedClass]);


  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.includes(searchTerm)
  );

  return (
    <div className="attendance-page">
      <h2>Auto Attendance Summary</h2>
      <form className="attendance-form">
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} required>
          <option value="">Select Class</option>
          <option value="7">Class 7</option>
          <option value="9">Class 9</option>
          <option value="10">Class 10</option>
        </select>

        {students.length > 0 && (
          <>
            <input
              type="text"
              placeholder="Search by name or roll no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
            <div className="student-list">
              {students.map((student, idx) => {
                const status = student.minutes >= 45 ? 'Present' : 'Absent';
                return (
                  <div key={idx} className="student-row">
                    {/* <span>{student.name}</span> */}
                    <span><strong>{student.rollNo}</strong> - {student.name}</span>
                    <span>{student.minutes} mins</span>
                    <span style={{ color: status === 'Present' ? 'green' : 'red' }}>
                      {status}
                    </span>
                  </div>
                );
              })}
              {filteredStudents.length === 0 && (
                <p className="no-results">No matching student found.</p>
              )}
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default TakeAttendance;













