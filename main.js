class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.userId = shortid.generate();
    this.createdAt = new Date().getTime();
    this.enrolledCourseIds = [];
    USERS.push(this);
  }

  browseCourses() {
    console.log("Available courses:");
    COURSES.forEach((course, index) => {
      console.log(`Course ${index + 1}: ${course.title}`);
    });
  }

  enrollCourse(courseId) {
    const course = COURSES.find((course) => course.courseId === courseId);
    if (course) {
      this.enrolledCourseIds.push(courseId);
      console.log("Course enrolled successfully.");
    } else {
      console.log("Course not found.");
    }
  }

  // ... other methods
}

class Instructor {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.instructorId = shortid.generate();
    this.createdAt = new Date().getTime();
    this.createdCourseIds = [];
    INSTRUCTORS.push(this);
    console.log("SignUp successful.");
  }

  createCourse() {
    // ... implementation
  }

  // ... other methods
}

// ... other classes

const USERS = [];
const INSTRUCTORS = [];
const COURSES = [];
const MODULES = [];
const ARTICLES = [];

const shortid = require("shortid");