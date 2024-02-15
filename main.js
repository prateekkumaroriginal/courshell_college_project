const readline = require('readline');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ARTICLES = [];
const MODULES = [];
const COURSES = [];
const INSTRUCTORS = [];
const USERS = [];
let CURRENT_LOGIN = null;

class Article {
    constructor(title, content, duration, moduleId, isOptional = false) {
        this.title = title;
        this.content = content;
        this.duration = duration;
        this.moduleId = moduleId;
        this.isOptional = isOptional;
        
        this.createdAt = Date.now();
        ARTICLES.push(this);
    }

    setTitle(title) {
        this.title = title;
    }

    setDuration(duration) {
        this.duration = duration;
    }

    setContent(content) {
        this.content = content;
    }

    setOptional() {
        this.isOptional = true;
    }

    setCompulsory() {
        this.isOptional = false;
    }
}

class Module {
    constructor(title, courseId) {
        this.title = title;
        this.courseId = courseId;
        
        this.createdAt = Date.now();
        this.articleIds = [];
        MODULES.push(this);
    }

    setTitle(title) {
        this.title = title;
    }

    findArticle(articleId) {
        if (!this.articleIds.includes(articleId)) {
            return null;
        }

        for (const article of ARTICLES) {
            if (article.articleId === articleId) {
                return article;
            }
        }

        return null;
    }

    addArticle() {
        try {
            const title = prompt("Enter article title: ");
            const content = prompt("Enter article content:-\n\n");
            const duration = parseInt(prompt("Enter duration in minutes: "));
            const isOptional = prompt("Is this article optional? (T/F): ").toUpperCase() === "T";
            
            const article = new Article({
                title,
                content,
                duration,
                isOptional,
                moduleId: this.moduleId,
            });

            this.articleIds.push(article.articleId);
            console.log("Article added successfully.");
        } catch (e) {
            console.log("Article not added.");
        }
    }

    removeArticle(articleId) {
        if (this.articleIds.includes(articleId)) {
            this.articleIds = this.articleIds.filter(id => id !== articleId);
            console.log("Article removed successfully.");
        } else {
            console.log("Article not found in this module.");
        }
    }
}

class Course {
    constructor(title, description, instructorId) {
        this.title = title;
        this.description = description;
        this.instructorId = instructorId;
        
        this.createdAt = Date.now();
        this.moduleIds = [];
        COURSES.push(this);
    }

    setTitle(title) {
        this.title = title;
    }

    findModule(moduleId) {
        if (!this.moduleIds.includes(moduleId)) {
            return null;
        }

        for (const module of MODULES) {
            if (module.moduleId === moduleId) {
                return module;
            }
        }

        return null;
    }

    addModule() {
        const title = prompt("Enter module title: ");
        const module = new Module(title, this.courseId);
        this.moduleIds.push(module.moduleId);
        console.log("Module added successfully.");
    }

    removeModule(moduleId) {
        if (this.moduleIds.includes(moduleId)) {
            this.moduleIds = this.moduleIds.filter(id => id !== moduleId);
            console.log("Module removed successfully.");
        } else {
            console.log("Module not found in this course.");
        }
    }
}

class Instructor {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    
        this.createdAt = Date.now();
        this.createdCourseIds = [];
        INSTRUCTORS.push(this);
        console.log("\nSignUp successful.\n\n");
    }

    createCourse() {
        const title = prompt("Enter course title: ");
        const description = prompt("Enter course description: ");
        const course = new Course(title, description, this.instructorId);
        this.createdCourseIds.push(course.courseId);
        console.log("Course created successfully.");
    }

    removeCourse(courseId) {
        if (this.createdCourseIds.includes(courseId)) {
            this.createdCourseIds = this.createdCourseIds.filter(id => id !== courseId);
            COURSES.filter(course => course.courseId === courseId).forEach(course => COURSES.splice(COURSES.indexOf(course), 1));
            console.log("Course removed successfully.");
        } else {
            console.log("Course not found in this instructor.");
        }
    }

    viewCreatedCourses() {
        console.log("Created courses:-");
        for (const course of COURSES) {
            if (course.instructorId === this.instructorId) {
                console.log(`Course 1: ${course.title}`);
            }
        }
        console.log("Viewing created courses completed.");
    }

    changePassword() {
        const newPassword = prompt("Enter new password: ");
        this.password = newPassword;
        console.log("Password changed successfully.");
    }

    changeUsername() {
        const newUsername = prompt("Enter new username: ");
        for (const instructor of INSTRUCTORS) {
            if (instructor.username === newUsername) {
                console.log("Instructor with the same username already exists.");
                return;
            }
        }
        this.username = newUsername;
        console.log("Username changed successfully.");
    }
}

class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        
        this.createdAt = Date.now();
        this.enrolledCourseIds = [];
        USERS.push(this);
        console.log("\nSignUp successful.\n\n");
    }

    browseCourses() {
        console.log("Available courses:-");
        for (const course of COURSES) {
            console.log(`Course Title: ${course.title}, Course ID: ${course.courseId}`);
        }
        console.log("Browsing courses completed.");
    }

    enrollCourse(courseId) {
        if (this.enrolledCourseIds.includes(courseId)) {
            console.log("Course already enrolled.");
            return;
        }

        for (const course of COURSES) {
            if (course.courseId === courseId) {
                this.enrolledCourseIds.push(courseId);
                console.log("\nCourse enrolled successfully.\n\n");
                return;
            }
        }

        console.log("\nCourse not found.\n\n");
    }

    unenrollCourse(courseId) {
        if (this.enrolledCourseIds.includes(courseId)) {
            this.enrolledCourseIds = this.enrolledCourseIds.filter(id => id !== courseId);
            console.log("\nCourse unenrolled successfully.\n\n");
        } else {
            console.log("\nCourse not enrolled.\n\n");
        }
    }

    changePassword() {
        const newPassword = prompt("Enter new password: ");
        this.password = newPassword;
        console.log("Password changed successfully.");
    }

    changeUsername() {
        const newUsername = prompt("Enter new username: ");
        for (const user of USERS) {
            if (user.username === newUsername) {
                console.log("User with the same username already exists.");
                return;
            }
        }
        this.username = newUsername;
        console.log("Username changed successfully.");
    }

    viewEnrolledCourses() {
        console.log("Enrolled courses:-");
        for (const courseId of this.enrolledCourseIds) {
            for (const course of COURSES) {
                if (course.courseId === courseId) {
                    console.log(`Title: ${course.title}, ID: ${course.courseId}`);
                }
            }
        }

        if (this.enrolledCourseIds.length === 0) {
            console.log("No courses enrolled.");
        } else {
            console.log("Viewing enrolled courses completed.");
        }
    }
}

function signUpUser() {
    const username = prompt("Enter username: ");
    for (const user of USERS) {
        if (user.username === username) {
            console.log("User with the same username already exists.");
            return;
        }
    }
    const password = prompt("Enter password: ");
    const user = new User(username, password);
    USERS.push(user);
    CURRENT_LOGIN = user;
}

function signUpInstructor() {
    const username = prompt("Enter username: ");
    for (const instructor of INSTRUCTORS) {
        if (instructor.username === username) {
            console.log("Instructor with the same username already exists.");
            return;
        }
    }
    const password = prompt("Enter password: ");
    const instructor = new Instructor(username, password);
    INSTRUCTORS.push(instructor);
    CURRENT_LOGIN = instructor;
}

function loginUser() {
    const username = prompt("Enter username: ");
    const password = prompt("Enter password: ");
    for (const user of USERS) {
        if (user.username === username && user.password === password) {
            CURRENT_LOGIN = user;
            console.log("\nLogin successful.\n\n");
            return;
        }
    }
    console.log("Invalid username or password.");
}

function loginInstructor() {
    const username = prompt("Enter username: ");
    const password = prompt("Enter password: ");
    for (const instructor of INSTRUCTORS) {
        if (instructor.username === username && instructor.password === password) {
            CURRENT_LOGIN = instructor;
            console.log("\nLogin successful.\n\n");
            return;
        }
    }
    console.log("Invalid username or password.");
}

function logout() {
    CURRENT_LOGIN = null;
    console.log("\nLogout successful.\n\n");
}

function findCourse(courseId) {
    for (const course of COURSES) {
        if (course.courseId === courseId) {
            return course;
        }
    }
    return null;
}

console.log(`\n${'-'.repeat(40)}Welcome to Courshell${'-'.repeat(40)}\n\n`);

while (true) {
    console.log("1. Sign Up as User");
    console.log("2. Sign Up as Instructor");
    console.log("3. Login as User");
    console.log("4. Login as Instructor");
    console.log("5. Exit Program");

    const choice = parseInt(prompt("\nEnter your choice: "));

    switch (choice) {
        case 1:
            signUpUser();
            break;
        case 2:
            signUpInstructor();
            break;
        case 3:
            loginUser();
            break;
        case 4:
            loginInstructor();
            break;
        case 5:
            console.log("Exiting...");
            process.exit();
        default:
            console.log("\nInvalid choice. Please try again.\n\n");
            break;
    }

    if (CURRENT_LOGIN instanceof User) {
        while (true) {
            console.log("1. Browse Courses");
            console.log("2. Enroll Course");
            console.log("3. View Enrolled Courses");
            console.log("4. View Course");
            console.log("5. Change Password");
            console.log("6. Change Username");
            console.log("7. Logout");
            console.log("8. Exit Program");

            const choice = parseInt(prompt("\nEnter your choice: "));

            switch (choice) {
                case 1:
                    CURRENT_LOGIN.browseCourses();
                    break;
                case 2:
                    const courseIdToEnroll = prompt("Enter course ID: ");
                    CURRENT_LOGIN.enrollCourse(courseIdToEnroll);
                    break;
                case 3:
                    CURRENT_LOGIN.viewEnrolledCourses();
                    break;
                case 4:
                    const courseIdToView = prompt("Enter course ID: ");
                    // Handle viewing course
                    break;
                case 5:
                    CURRENT_LOGIN.changePassword();
                    break;
                case 6:
                    CURRENT_LOGIN.changeUsername();
                    break;
                case 7:
                    logout();
                    break;
                case 8:
                    console.log("Exiting...");
                    process.exit();
                default:
                    console.log("\nInvalid choice. Please try again.\n\n");
                    break;
            }
        }
    }

    if (CURRENT_LOGIN instanceof Instructor) {
        while (true) {
            console.log("1. Create Course");
            console.log("2. Remove Course");
            console.log("3. Change Password");
            console.log("4. Change Username");
            console.log("5. View Created Courses");
            console.log("6. Update Course");
            console.log("7. Logout");
            console.log("8. Exit Program");

            const choice = parseInt(prompt("\nEnter your choice: "));

            switch (choice) {
                case 1:
                    CURRENT_LOGIN.createCourse();
                    break;
                case 2:
                    const courseIdToRemove = prompt("Enter course ID: ");
                    CURRENT_LOGIN.removeCourse(courseIdToRemove);
                    break;
                case 3:
                    CURRENT_LOGIN.changePassword();
                    break;
                case 4:
                    CURRENT_LOGIN.changeUsername();
                    break;
                case 5:
                    CURRENT_LOGIN.viewCreatedCourses();
                    break;
                case 6:
                    const courseIdToUpdate = prompt("Enter course ID: ");
                    // Handle updating course
                    break;
                case 7:
                    logout();
                    break;
                case 8:
                    console.log("Exiting...");
                    process.exit();
                default:
                    console.log("\nInvalid choice. Please try again.\n\n");
                    break;
            }
        }
    }
}

