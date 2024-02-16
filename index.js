import readlineSync from 'readline-sync';
import shortuuid from 'short-uuid';
import terminalSize from 'terminal-size';

const COURSES = [];
const MODULES = [];
const ARTICLES = [];
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
        this.articleId = shortuuid.generate();
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
        this.moduleId = shortuuid.generate();
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
        return ARTICLES.find(article => article.articleId === articleId);
    }

    addArticle() {
        try {
            const title = readlineSync.question("Enter article title: ");
            const content = readlineSync.question("Enter article content:\n\n");
            const duration = parseInt(readlineSync.question("Enter duration in minutes: "));
            const isOptional = readlineSync.question("Is this article optional? (T/F): ").toUpperCase() === "T";
            const article = new Article(title, content, duration, this.moduleId, isOptional);
            this.articleIds.push(article.articleId);
            console.log("Article added successfully.");
        } catch (e) {
            console.log("Article not added.");
        }
    }

    removeArticle(articleId) {
        const index = this.articleIds.indexOf(articleId);
        if (index !== -1) {
            this.articleIds.splice(index, 1);
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
        this.courseId = shortuuid.generate();
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
        return MODULES.find(module => module.moduleId === moduleId);
    }

    addModule() {
        const title = readlineSync.question("Enter module title: ");
        const module = new Module(title, this.courseId);
        this.moduleIds.push(module.moduleId);
        console.log("Module added successfully.");
    }

    removeModule(moduleId) {
        const index = this.moduleIds.indexOf(moduleId);
        if (index !== -1) {
            this.moduleIds.splice(index, 1);
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
        this.instructorId = shortuuid.generate();
        this.createdAt = Date.now();
        this.createdCourseIds = [];
        INSTRUCTORS.push(this);
        console.log("\nSignUp successful.\n\n");
    }

    createCourse() {
        const title = readlineSync.question("Enter course title: ");
        const description = readlineSync.question("Enter course description: ");
        const course = new Course(title, description, this.instructorId);
        this.createdCourseIds.push(course.courseId);
        console.log("Course created successfully.");
    }

    removeCourse(courseId) {
        const index = this.createdCourseIds.indexOf(courseId);
        if (index !== -1) {
            this.createdCourseIds.splice(index, 1);
            const courseIndex = COURSES.findIndex(course => course.courseId === courseId);
            if (courseIndex !== -1) {
                COURSES.splice(courseIndex, 1);
            }
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
        const newPassword = readlineSync.question("Enter new password: ");
        this.password = newPassword;
        console.log("Password changed successfully.");
    }

    changeUsername() {
        const newUsername = readlineSync.question("Enter new username: ");
        const existingInstructor = INSTRUCTORS.find(instructor => instructor.username === newUsername);
        if (existingInstructor) {
            console.log("Instructor with same username already exists.");
            return;
        }
        this.username = newUsername;
        console.log("Username changed successfully.");
    }
}

class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.userId = shortuuid.generate();
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
        const course = COURSES.find(course => course.courseId === courseId);
        if (course) {
            this.enrolledCourseIds.push(courseId);
            console.log("\nCourse enrolled successfully.\n\n");
        } else {
            console.log("\nCourse not found.\n\n");
        }
    }

    unenrollCourse(courseId) {
        const index = this.enrolledCourseIds.indexOf(courseId);
        if (index !== -1) {
            this.enrolledCourseIds.splice(index, 1);
            console.log("\nCourse unenrolled successfully.\n\n");
        } else {
            console.log("\nCourse not enrolled.\n\n");
        }
    }

    changePassword() {
        const newPassword = readlineSync.question("Enter new password: ");
        this.password = newPassword;
        console.log("Password changed successfully.");
    }

    changeUsername() {
        const newUsername = readlineSync.question("Enter new username: ");
        const existingUser = USERS.find(user => user.username === newUsername);
        if (existingUser) {
            console.log("User with same username already exists.");
            return;
        }
        this.username = newUsername;
        console.log("Username changed successfully.");
    }

    viewEnrolledCourses() {
        console.log("Enrolled courses:-");
        for (const courseId of this.enrolledCourseIds) {
            const course = COURSES.find(course => course.courseId === courseId);
            if (course) {
                console.log(`Title: ${course.title}, ID: ${course.courseId}`);
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
    const username = readlineSync.question("Enter username: ");
    const existingUser = USERS.find(user => user.username === username);
    if (existingUser) {
        console.log("User with same username already exists.");
        return;
    }
    const password = readlineSync.question("Enter password: ");
    const user = new User(username, password);
    USERS.push(user);
    CURRENT_LOGIN = user;
}

function signUpInstructor() {
    const username = readlineSync.question("Enter username: ");
    const existingInstructor = INSTRUCTORS.find(user => user.username === username);
    if (existingInstructor) {
        console.log("User with same username already exists.");
        return;
    }
    const password = readlineSync.question("Enter password: ");
    const instructor = new Instructor(username, password);
    INSTRUCTORS.push(instructor);
    CURRENT_LOGIN = instructor;
}

function loginUser() {
    const username = readlineSync.question("Enter username: ");
    const password = readlineSync.question("Enter password: ");
    const user = USERS.find(user => user.username === username && user.password === password);
    if (user) {
        CURRENT_LOGIN = user;
        console.log("\nLogin successful.\n\n");
    } else {
        console.log("Invalid username or password.");
    }
}

function loginInstructor() {
    const username = readlineSync.question("Enter username: ");
    const password = readlineSync.question("Enter password: ");
    const instructor = INSTRUCTORS.find(instructor => instructor.username === username && instructor.password === password);
    if (instructor) {
        CURRENT_LOGIN = instructor;
        console.log("\nLogin successful.\n\n");
    } else {
        console.log("Invalid username or password.");
    }
}

function logout() {
    CURRENT_LOGIN = null;
    console.log("\nLogout successful.\n\n");
}

function findCourse(courseId) {
    return COURSES.find(course => course.courseId === courseId);
}

const nrDashes = Math.floor((terminalSize().columns - "Welcome to Courshell".length) / 2);
console.log('-'.repeat(nrDashes) + "Welcome to Courshell" + '-'.repeat(nrDashes));

while (true) {
    console.log("1. Sign Up as User");
    console.log("2. Sign Up as Instructor");
    console.log("3. Login as User");
    console.log("4. Login as Instructor");
    console.log("5. Exit Program");

    let choice;
    try {
        choice = parseInt(readlineSync.question("\nEnter your choice: "));
    } catch (error) {
        if (error instanceof TypeError) {
            console.log("\nInvalid choice. Please try again.\n\n");
            continue;
        }
    }

    if (choice === 1) {
        signUpUser();
    } else if (choice === 2) {
        signUpInstructor();
    } else if (choice === 3) {
        loginUser();
    } else if (choice === 4) {
        loginInstructor();
    } else if (choice === 5) {
        console.log("Exiting...");
        break;
    } else {
        console.log("\nInvalid choice. Please try again.\n\n");
        continue;
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

            const choice = parseInt(readlineSync.question("\nEnter your choice: "));

            if (choice === 1) {
                CURRENT_LOGIN.browseCourses();
            } else if (choice === 2) {
                const courseId = readlineSync.question("Enter course ID: ");
                CURRENT_LOGIN.enrollCourse(courseId);
            } else if (choice === 3) {
                CURRENT_LOGIN.viewEnrolledCourses();
            } else if (choice === 4) {
                const courseId = readlineSync.question("Enter course ID: ");
                if (CURRENT_LOGIN.enrolledCourseIds.includes(courseId)) {
                    const course = findCourse(courseId);
                    if (course) {
                        console.log(`Title: ${course.title}`);
                        console.log(`Description: ${course.description}`);
                        console.log("Modules:-\n");
                        const modules = [];
                        for (let i = 0; i < course.moduleIds.length; i++) {
                            const module = course.findModule(course.moduleIds[i]);
                            if (module) {
                                console.log(`Module ${i + 1}: ${module.title}`);
                                modules.push(module);
                            }
                        }
                        if (modules.length === 0) {
                            console.log("No modules found.");
                            continue;
                        }
                        while (true) {
                            console.log("1. Enter Module");
                            console.log("2. Unenroll from Course");
                            console.log("3. Back to User Menu");
                            console.log("4. Exit Program");

                            const choice = parseInt(readlineSync.question("\nEnter your choice: "));

                            if (choice === 1) {
                                let moduleIndex;
                                try {
                                    moduleIndex = parseInt(readlineSync.question("Enter module index: ")) - 1;
                                } catch (e) {
                                    console.log("\nInvalid module index. Please try again.\n\n");
                                    continue;
                                }
                                if (moduleIndex < 0 || moduleIndex >= modules.length) {
                                    console.log("\nInvalid module index. Please try again.\n\n");
                                    continue;
                                }
                                const module = modules[moduleIndex];
                                console.log(module.title);
                                console.log("Articles:-\n");
                                const articles = [];
                                for (let i = 0; i < module.articleIds.length; i++) {
                                    const article = module.findArticle(module.articleIds[i]);
                                    if (article) {
                                        console.log(`Article ${i + 1}: ${article.title}`);
                                        articles.push(article);
                                    }
                                }
                                if (articles.length === 0) {
                                    console.log("No articles found.");
                                    continue;
                                }
                                while (true) {
                                    console.log("1. Read Article");
                                    console.log("2. Back to Module Menu");
                                    console.log("3. Exit Program");

                                    const choice = parseInt(readlineSync.question("\nEnter your choice: "));

                                    if (choice === 1) {
                                        let articleIndex;
                                        try {
                                            articleIndex = parseInt(readlineSync.question("Enter article index: ")) - 1;
                                        } catch (e) {
                                            console.log("\nInvalid article index. Please try again.\n\n");
                                            continue;
                                        }
                                        if (articleIndex < 0 || articleIndex >= articles.length) {
                                            console.log("\nInvalid article index. Please try again.\n\n");
                                            continue;
                                        }
                                        const article = articles[articleIndex];
                                        const nrDashes = Math.floor((terminalSize().columns - article.title.length) / 2);
                                        console.log('-'.repeat(nrDashes) + article.title + '-'.repeat(nrDashes))
                                        console.log(article.content);
                                        console.log('-'.repeat(2 * nrDashes + article.title.length))
                                    } else if (choice === 2) {
                                        break;
                                    } else if (choice === 3) {
                                        console.log("Exiting...");
                                        process.exit();
                                    } else {
                                        console.log("\nInvalid choice. Please try again.\n\n");
                                    }
                                }

                            } else if (choice === 2) {
                                CURRENT_LOGIN.unenrollCourse(courseId);
                                break;
                            } else if (choice === 3) {
                                break;
                            } else if (choice === 4) {
                                console.log("Exiting...");
                                process.exit();
                            } else {
                                console.log("\nInvalid choice. Please try again.\n\n");
                            }
                        }
                    }
                } else {
                    console.log("\nYou are not enrolled in this course.\n\n");
                }
            } else if (choice === 5) {
                CURRENT_LOGIN.changePassword();
            } else if (choice === 6) {
                CURRENT_LOGIN.changeUsername();
            } else if (choice === 7) {
                logout();
                break;
            } else if (choice === 8) {
                console.log("Exiting...");
                process.exit();
            } else {
                console.log("\nInvalid choice. Please try again.\n\n");
            }
        }
    } else if (CURRENT_LOGIN instanceof Instructor) {
        while (true) {
            console.log("1. Create Course");
            console.log("2. View Created Courses");
            console.log("3. Remove Course");
            console.log("4. Update Course");
            console.log("5. Change Password");
            console.log("6. Change Username");
            console.log("7. Logout");
            console.log("8. Exit Program");

            const choice = parseInt(readlineSync.question("\nEnter your choice: "));

            if (choice === 1) {
                CURRENT_LOGIN.createCourse();
            } else if (choice === 2) {
                CURRENT_LOGIN.viewCreatedCourses();
            } else if (choice === 3) {
                try {
                    const courseIndex = parseInt(readlineSync.question("Enter course index: ")) - 1;
                    if (courseIndex < 0 || courseIndex >= CURRENT_LOGIN.createdCourseIds.length) {
                        console.log("\nInvalid course index. Please try again.\n\n");
                        continue;
                    }
                } catch (error) {
                    if (error instanceof TypeError) {
                        console.log("\nInvalid course index. Please try again.\n\n");
                        continue;
                    }
                }

                const courseId = CURRENT_LOGIN.createdCourseIds[courseIndex];
                CURRENT_LOGIN.removeCourse(courseId);
            } else if (choice === 4) {
                let courseIndex;
                try {
                    courseIndex = parseInt(readlineSync.question("Enter course index: ")) - 1;
                    if (courseIndex < 0 || courseIndex >= CURRENT_LOGIN.createdCourseIds.length) {
                        console.log("\nInvalid course index. Please try again.\n\n");
                        continue;
                    }
                } catch (error) {
                    if (error instanceof TypeError) {
                        console.log("\nInvalid course index. Please try again.\n\n");
                        continue;
                    }
                }

                const courseId = CURRENT_LOGIN.createdCourseIds[courseIndex];
                const course = findCourse(courseId);
                if (course) {
                    const nrDashes = Math.floor((terminalSize().columns - course.title.length) / 2);
                    console.log('-'.repeat(nrDashes) + course.title + '-'.repeat(nrDashes))

                    while (true) {
                        console.log("1. Update Course Title");
                        console.log("2. Update Course Description");
                        console.log("3. Add Module");
                        console.log("4. Remove Module");
                        console.log("5. View Modules");
                        console.log("6. Update Module");
                        console.log("7. Back to Instructor Menu");
                        console.log("8. Exit Program");

                        let choice;
                        try {
                            choice = parseInt(readlineSync.question("\nEnter your choice: "));
                        } catch (error) {
                            console.log("\nInvalid choice. Please try again.\n\n");
                            continue;
                        }

                        if (choice === 1) {
                            const newTitle = readlineSync.question("Enter new title: ");
                            course.setTitle(newTitle);
                            console.log("Course title updated successfully.");
                        } else if (choice === 2) {
                            const newDescription = readlineSync.question("Enter new description: ");
                            course.description = newDescription;
                            console.log("Course description updated successfully.");
                        } else if (choice === 3) {
                            course.addModule();
                        } else if (choice === 4) {
                            let moduleIndex;
                            try {
                                moduleIndex = parseInt(readlineSync.question("Enter module index: ")) - 1;
                                if (moduleIndex < 0 || moduleIndex >= course.moduleIds.length) {
                                    console.log("\nInvalid module index. Please try again.\n\n");
                                    continue;
                                }
                            } catch (error) {
                                console.log("\nInvalid module index. Please try again.\n\n");
                                continue;
                            }

                            const moduleId = course.moduleIds[moduleIndex];
                            course.removeModule(moduleId);
                        } else if (choice === 5) {
                            console.log("Modules:-");
                            const modules = [];
                            for (let i = 0; i < course.moduleIds.length; i++) {
                                const moduleId = course.moduleIds[i];
                                const module = course.findModule(moduleId);
                                if (module) {
                                    console.log(`Module ${i + 1}: ${module.title}`);
                                    modules.push(module);
                                }
                            }
                            if (modules.length === 0) {
                                console.log("No modules found.");
                            }
                        } else if (choice === 6) {
                            const modules = []
                            for (let i = 0; i < course.moduleIds.length; i++) {
                                const moduleId = course.moduleIds[i];
                                const module = course.findModule(moduleId);
                                if (module) {
                                    modules.push(module);
                                }
                            }

                            let moduleIndex;
                            try {
                                moduleIndex = parseInt(readlineSync.question("Enter module index: ")) - 1;
                                if (moduleIndex < 0 || moduleIndex >= modules.length) {
                                    console.log("\nInvalid module index. Please try again.\n\n");
                                    continue;
                                }
                            } catch (error) {
                                console.log("\nInvalid module index. Please try again.\n\n");
                                continue
                            }

                            const module = modules[moduleIndex];
                            let nrDashes = Math.floor((terminalSize().columns - module.title.length) / 2);
                            console.log('-'.repeat(nrDashes) + module.title + '-'.repeat(nrDashes))

                            while (true) {
                                console.log("1. Update Module Title")
                                console.log("2. Add Article")
                                console.log("3. Remove Article")
                                console.log("4. View Articles")
                                console.log("5. Update Article")
                                console.log("6. Back to Course Menu")
                                console.log("7. Exit Program")

                                let choice;
                                try {
                                    choice = parseInt(readlineSync.question("\nEnter your choice: "));
                                } catch (error) {
                                    console.log("\nInvalid choice. Please try again.\n\n");
                                    continue;
                                }
                                if (choice === 1) {
                                    const newTitle = readlineSync.question("Enter new title: ");
                                    module.setTitle(newTitle);
                                    console.log("Module title updated successfully.");
                                } else if (choice === 2) {
                                    module.addArticle();
                                } else if (choice === 3) {
                                    let articleIndex;
                                    try {
                                        articleIndex = parseInt(readlineSync.question("Enter article index: ")) - 1;
                                        if (articleIndex < 0 || articleIndex >= module.articleIds.length) {
                                            console.log("\nInvalid article index. Please try again.\n\n");
                                            continue;
                                        }
                                    } catch (error) {
                                        console.log("\nInvalid article index. Please try again.\n\n");
                                        continue;
                                    }

                                    const articleId = module.articleIds[articleIndex];
                                    module.removeArticle(articleId);
                                } else if (choice === 4) {
                                    console.log("Articles:-");
                                    const articles = [];
                                    for (let i = 0; i < module.articleIds.length; i++) {
                                        const articleId = module.articleIds[i];
                                        const article = module.findArticle(articleId);
                                        if (article) {
                                            console.log(`Article ${i + 1}: ${article.title}`);
                                            articles.push(article);
                                        }
                                    }

                                    if (articles.length === 0) {
                                        console.log("No articles found.");
                                    }
                                } else if (choice === 5) {
                                    const articles = [];
                                    for (let i = 0; i < module.articleIds.length; i++) {
                                        const articleId = module.articleIds[i];
                                        const article = module.findArticle(articleId);
                                        if (article) {
                                            articles.push(article);
                                        }
                                    }

                                    let articleIndex;
                                    try {
                                        articleIndex = parseInt(readlineSync.question("Enter article index: ")) - 1;
                                        if (articleIndex < 0 || articleIndex >= articles.length) {
                                            console.log("\nInvalid article index. Please try again.\n\n");
                                            continue;
                                        }
                                    } catch (error) {
                                        console.log("\nInvalid article index. Please try again.\n\n");
                                        continue;
                                    }

                                    while (true) {
                                        console.log("1. Update Article Title");
                                        console.log("2. Update Article Duration");
                                        console.log("3. Update Article Content");
                                        console.log("4. Set Article Optional");
                                        console.log("5. Set Article Compulsory");
                                        console.log("6. Back to Module Menu");
                                        console.log("7. Exit Program");

                                        try {
                                            choice = parseInt(readlineSync.question("\nEnter your choice: "));
                                        } catch (error) {
                                            console.log("\nInvalid choice. Please try again.\n\n");
                                            continue;
                                        }

                                        if (choice === 1) {
                                            const newTitle = readlineSync.question("Enter new title: ");
                                            articles[articleIndex].setTitle(newTitle);
                                            console.log("Article title updated successfully.");
                                        } else if (choice === 2) {
                                            const newDuration = readlineSync.question("Enter new duration: ");
                                            articles[articleIndex].setDuration(newDuration);
                                            console.log("Article duration updated successfully.");
                                        } else if (choice === 3) {
                                            const newContent = readlineSync.question("Enter new content: ");
                                            articles[articleIndex].setContent(newContent);
                                            console.log("Article content updated successfully.");
                                        } else if (choice === 4) {
                                            articles[articleIndex].setOptional();
                                            console.log("Article set to optional.");
                                        } else if (choice === 5) {
                                            articles[articleIndex].setCompulsory();
                                            console.log("Article set to compulsory.");
                                        } else if (choice === 6) {
                                            break;
                                        } else if (choice === 7) {
                                            console.log("Exiting...");
                                            process.exit();
                                        } else {
                                            console.log("\nInvalid choice. Please try again.\n\n");
                                        }
                                    }
                                } else if (choice === 6) {
                                    break;
                                } else if (choice === 7) {
                                    console.log("Exiting...");
                                    process.exit();
                                } else {
                                    console.log("\nInvalid choice. Please try again.\n\n");
                                }
                            }
                        } else if (choice === 7) {
                            break;
                        } else if (choice === 8) {
                            console.log("Exiting...");
                            process.exit();
                        } else {
                            console.log("\nInvalid choice. Please try again.\n\n");
                        }
                    }
                } else {
                    console.log("\nCourse not found.\n\n");
                }
            } else if (choice === 5) {
                CURRENT_LOGIN.changePassword();
            } else if (choice === 6) {
                CURRENT_LOGIN.changeUsername();
            } else if (choice === 7) {
                logout();
                break;
            } else if (choice === 8) {
                console.log("Exiting...");
                process.exit();
            } else {
                console.log("\nInvalid choice. Please try again.\n\n");
            }
        }
    }
}
