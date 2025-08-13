import React, { useState, useEffect } from 'react';
import '../styles/studentDashboard.css';
import {
  FaBookOpen,
  FaTasks,
  FaQuestionCircle,
  FaCreditCard,
  FaChartLine,
  FaClock,
  FaUserCheck
} from 'react-icons/fa';

const StudentDashboard = ({ student: propStudent }) => {
  const [student, setStudent] = useState(propStudent || null);
  const [stats, setStats] = useState({
    enrolledSubjects: 0,
    pendingAssignments: 0,
    completedAssignments: 0,
    upcomingClasses: 0,
    lastPayment: 'Pending',
    attendance: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolledSubjectsList, setEnrolledSubjectsList] = useState([]);

  // Load student data from localStorage if not provided as prop
  useEffect(() => {
    if (!student) {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.student) {
          setStudent(parsedUser.student);
        } else if (parsedUser.role === 'student') {
          setStudent(parsedUser);
        }
      }
    }
  }, [student]);

  // Fetch dashboard data when student is available
  useEffect(() => {
    if (student && student.id) {
      fetchDashboardData();
      fetchRecentActivities();
    }
  }, [student]);

  // Add this in your fetchDashboardData function
  const fetchDashboardData = async () => {
    try {
      console.log('Student object:', student); // Debug student object
      console.log('Student ID:', student.id); // Debug student ID

      if (!student.id) {
        console.error('Student ID is missing!');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/student/${student.id}/dashboard`);
      console.log('Response status:', response.status); // Debug response status
      console.log('Response headers:', response.headers.get('content-type')); // Debug content type

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
        setEnrolledSubjectsList(data.enrolledSubjectsList || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await fetch(`/api/student/${student.id}/activities`);
      const data = await response.json();

      if (data.success) {
        setRecentActivities(data.recentActivities);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  // Show loading or default message if student data is not available
  if (!student) {
    return (
      <div className="student-portal">
        <div className="student-portal-header">
          <div className="student-welcome-section">
            <div className="student-welcome-text">
              <h1>Welcome to Student Dashboard!</h1>
              <p>Please log in to view your student information</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="student-portal">
        <div className="student-portal-header">
          <div className="student-welcome-section">
            <div className="student-welcome-text">
              <h1>Loading Dashboard...</h1>
              <p>Please wait while we fetch your data</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-portal">
      {/* Header Section */}
      <div className="student-portal-header">
        <div className="student-welcome-section">
          <div className="student-welcome-text">
            <h1>Welcome back, {student?.firstName ? `${student.firstName}${student.lastName ? ` ${student.lastName}` : ''}` : 'Student'}!</h1>
            <p>Here's what's happening with your studies today</p>
          </div>
        </div>
        {/* Stats Section */}
        <div className="student-header-stats">
          <div className="student-stat-item">
            <span className="students-stat-number">{stats.enrolledSubjects}</span>
            <span className="students-stat-label">Subjects</span>
          </div>
          <div className="student-stat-item">
            <span className="students-stat-number">{stats.attendance}%</span>
            <span className="students-stat-label">Attendance</span>
          </div>
        </div>
      </div>

      <div className="student-header-info">
        {/* Status Banners */}
        {student && student.approvalStatus !== 'Approved' && (
          <div className="student-reminder-banner">
            ⏳ Your registration is pending admin approval.
          </div>
        )}

        {student && student.status !== 'Paid' && student.approvalStatus === 'Approved' && (
          <div className="student-reminder-banner">
            ⚠️ You haven't completed the payment yet. Please contact admin.
          </div>
        )}

        {student && student.status === 'Paid' && (
          <div className="student-reminder-banner student-success">
            ✅ Your account is active and payment is up to date!
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="student-stats-grid">
        <div className="student-stat-card student-primary">
          <div className="student-stat-content">
            <div className="student-stat-info">
              <h4>{stats.pendingAssignments}</h4>
              <p>Pending Assignments</p>
            </div>
          </div>
          <div className="student-stat-footer">
            <span className="student-stat-change student-negative">Due soon</span>
          </div>
        </div>

        <div className="student-stat-card student-warning">
          <div className="student-stat-content">
            <div className="student-stat-info">
              <h4>{stats.upcomingClasses}</h4>
              <p>Upcoming Classes</p>
            </div>
          </div>
          <div className="student-stat-footer">
            <span className="student-stat-change">Today</span>
          </div>
        </div>

        <div className="student-stat-card student-info">
          <div className="student-stat-content">
            <div className="student-stat-info">
              <h4>{stats.lastPayment}</h4>
              <p>Payment Status</p>
            </div>
          </div>
          <div className="student-stat-footer">
            <span className="student-stat-change">{student.status === 'Paid' ? 'Up to date' : 'Pending'}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="student-portal-content-grid">
        {/* Recent Activities */}
        <div className="student-portal-section">
          <h3 className="student-section-title">
            <FaClock className="student-section-icon" />
            Recent Activities
          </h3>
          <div className="student-activities-list">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="student-activity-item">
                  <div className={`student-activity-icon ${activity.type}`}>
                    {activity.type === 'assignment' && <FaTasks />}
                    {activity.type === 'class' && <FaBookOpen />}
                    {activity.type === 'payment' && <FaCreditCard />}
                    {activity.type === 'quiz' && <FaQuestionCircle />}
                    {activity.type === 'registration' && <FaUserCheck />}
                    {activity.type === 'approval' && <FaUserCheck />}
                  </div>
                  <div className="student-activity-content">
                    <p className="student-activity-text">{activity.activity}</p>
                    <span className="student-activity-time">{activity.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="student-no-activities">
                <p>No recent activities to display</p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Section */}
        <div className="student-portal-section">
          <h3 className="student-section-title">
            <FaChartLine className="student-section-icon" />
            Progress Overview
          </h3>
          <div className="student-progress-container">
            <div className="student-progress-item">
              <div className="student-progress-header">
                <span>Overall Attendance</span>
                <span className="student-progress-value">{stats.attendance}%</span>
              </div>
              <div className="student-progress-bar">
                <div
                  className="student-progress-fill"
                  style={{ width: `${stats.attendance}%` }}
                ></div>
              </div>
            </div>

            <div className="student-progress-item">
              <div className="student-progress-header">
                <span>Assignment Completion</span>
                <span className="student-progress-value">
                  {stats.completedAssignments + stats.pendingAssignments > 0
                    ? Math.round((stats.completedAssignments / (stats.completedAssignments + stats.pendingAssignments)) * 100)
                    : 0}%
                </span>
              </div>
              <div className="student-progress-bar">
                <div
                  className="student-progress-fill"
                  style={{
                    width: `${stats.completedAssignments + stats.pendingAssignments > 0
                      ? Math.round((stats.completedAssignments / (stats.completedAssignments + stats.pendingAssignments)) * 100)
                      : 0}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="student-progress-item">
              <div className="student-progress-header">
                <span>Course Progress</span>
                <span className="student-progress-value">
                  {enrolledSubjectsList.length > 0 ? Math.round((stats.enrolledSubjects / enrolledSubjectsList.length) * 100) : 0}%
                </span>
              </div>
              <div className="student-progress-bar">
                <div
                  className="student-progress-fill"
                  style={{
                    width: `${enrolledSubjectsList.length > 0 ? Math.round((stats.enrolledSubjects / enrolledSubjectsList.length) * 100) : 0}%`
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Enrolled Subjects List */}
          {enrolledSubjectsList.length > 0 && (
            <div className="student-subjects-section" style={{ marginTop: '20px' }}>
              <h4>Enrolled Subjects:</h4>
              <div className="student-subjects-list">
                {enrolledSubjectsList.map((subject, index) => (
                  <span key={index} className="student-subject-tag">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
