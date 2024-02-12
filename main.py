import time
import shortuuid
import os

COURSES = []
MODULES = []
ARTICLES = []
INSTRUCTORS = []
USERS = []
CURRENT_LOGIN = None


class Article:
    def __init__(self, title, content, duration, moduleId, isOptional=False):
        self.title = title
        self.content = content
        self.duration = duration
        self.moduleId = moduleId
        self.isOptional = isOptional
        self.articleId = shortuuid.uuid()
        self.createdAt = time.time()
        ARTICLES.append(self)

    def setTitle(self, title):
        self.title = title

    def setDuration(self, duration):
        self.duration = duration

    def setContent(self, content):
        self.content = content

    def setOptional(self):
        self.isOptional = True

    def setCompulsory(self):
        self.isOptional = False


class Module:
    def __init__(self, title, courseId):
        self.title = title
        self.courseId = courseId
        self.moduleId = shortuuid.uuid()
        self.createdAt = time.time()
        self.articleIds = []
        MODULES.append(self)

    def setTitle(self, title):
        self.title = title

    def findArticle(self, articleId):
        if articleId not in self.articleIds:
            return None
        for article in ARTICLES:
            if article.articleId == articleId:
                return article

    def addArticle(self):
        try:
            title = input("Enter article title: ")
            content = input("Enter article content:-\n\n")
            duration = int(input("Enter duration in minutes: "))
            isOptional = input("Is this article optional? (T/F): ")
            article = Article(
                title=title,
                content=content,
                duration=duration,
                isOptional=True if isOptional == "T" else False,
                moduleId=self.moduleId,
            )
            self.articleIds.append(article.articleId)
            print("Article added successfully.")
        except Exception as e:
            print("Article not added.")

    def removeArticle(self, articleId):
        if articleId in self.articleIds:
            self.articleIds.remove(articleId)
            print("Article removed successfully.")
        else:
            print("Article not found in this module.")


class Course:
    def __init__(self, title, description, instructorId):
        self.title = title
        self.description = description
        self.instructorId = instructorId
        self.courseId = shortuuid.uuid()
        self.createdAt = time.time()
        self.moduleIds = []

    def setTitle(self, title):
        self.title = title

    def findModule(self, moduleId):
        if moduleId not in self.moduleIds:
            return None
        for module in MODULES:
            if module.moduleId == moduleId:
                return module

    def addModule(self):
        title = input("Enter module title: ")
        module = Module(title, self.courseId)
        self.moduleIds.append(module.moduleId)
        print("Module added successfully.")

    def removeModule(self, moduleId):
        if moduleId in self.moduleIds:
            self.moduleIds.remove(moduleId)
            print("Module removed successfully.")
        else:
            print("Module not found in this course.")


class Instructor:
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.instructorId = shortuuid.uuid()
        self.createdAt = time.time()
        self.createdCourseIds = []
        INSTRUCTORS.append(self)
        print("\nSignUp successful.\n\n")

    def createCourse(self):
        title = input("Enter course title: ")
        description = input("Enter course description: ")
        course = Course(title, description, self.instructorId)
        COURSES.append(course)
        self.createdCourseIds.append(course.courseId)
        print("Course created successfully.")

    def removeCourse(self, courseId):
        if courseId in self.createdCourseIds:
            self.createdCourseIds.remove(courseId)
            for course in COURSES:
                if course.courseId == courseId:
                    COURSES.remove(course)
            print("Course removed successfully.")
        else:
            print("Course not found in this instructor.")

    def viewCreatedCourses(self):
        print("Created courses:-")
        for course in COURSES:
            if course.instructorId == self.instructorId:
                print(f"Course 1: {course.title}")
        print("Viewing created courses completed.")

    def changePassword(self):
        newPassword = input("Enter new password: ")
        self.password = newPassword
        print("Password changed successfully.")

    def changeUsername(self):
        newUsername = input("Enter new username: ")
        for instructor in INSTRUCTORS:
            if instructor.username == newUsername:
                print("Instructor with same username already exists.")
                return
        self.username = newUsername
        print("Username changed successfully.")


class User:
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.userId = shortuuid.uuid()
        self.createdAt = time.time()
        self.enrolledCourseIds = []
        USERS.append(self)
        print("\nSignUp successful.\n\n")

    def browseCourses(self):
        print("Available courses:-")
        for course in COURSES:
            print(f"Course Title: {course.title}, Course ID: {course.courseId}")
        print("Browsing courses completed.")

    def enrollCourse(self, courseId):
        if courseId in self.enrolledCourseIds:
            print("Course already enrolled.")
            return

        for course in COURSES:
            if course.courseId == courseId:
                self.enrolledCourseIds.append(courseId)
                print("\nCourse enrolled successfully.\n\n")
                return

        print("\nCourse not found.\n\n")

    def unenrollCourse(self, courseId):
        if courseId in self.enrolledCourseIds:
            self.enrolledCourseIds.remove(courseId)
            print("\nCourse unenrolled successfully.\n\n")
        else:
            print("\nCourse not enrolled.\n\n")

    def changePassword(self):
        newPassword = input("Enter new password: ")
        self.password = newPassword
        print("Password changed successfully.")

    def changeUsername(self):
        newUsername = input("Enter new username: ")
        for user in USERS:
            if user.username == newUsername:
                print("User with same username already exists.")
                return
        self.username = newUsername
        print("Username changed successfully.")

    def viewEnrolledCourses(self):
        print("Enrolled courses:-")
        for courseId in self.enrolledCourseIds:
            for course in COURSES:
                if course.courseId == courseId:
                    print(f"Title: {course.title}, ID: {course.courseId}")

        if not self.enrolledCourseIds:
            print("No courses enrolled.")
        else:
            print("Viewing enrolled courses completed.")


def signUpUser():
    global CURRENT_LOGIN
    username = input("Enter username: ")
    for user in USERS:
        if user.username == username:
            print("User with same username already exists.")
            return
    password = input("Enter password: ")
    user = User(username, password)
    USERS.append(user)
    CURRENT_LOGIN = user


def signUpInstructor():
    global CURRENT_LOGIN
    username = input("Enter username: ")
    for instructor in INSTRUCTORS:
        if instructor.username == username:
            print("Instructor with same username already exists.")
            return
    password = input("Enter password: ")
    instructor = Instructor(username, password)
    INSTRUCTORS.append(instructor)
    CURRENT_LOGIN = instructor


def loginUser():
    global CURRENT_LOGIN
    username = input("Enter username: ")
    password = input("Enter password: ")
    for user in USERS:
        if user.username == username and user.password == password:
            CURRENT_LOGIN = user
            print("\nLogin successful.\n\n")
            return
    print("Invalid username or password.")


def loginInstructor():
    global CURRENT_LOGIN
    username = input("Enter username: ")
    password = input("Enter password: ")
    for instructor in INSTRUCTORS:
        if instructor.username == username and instructor.password == password:
            CURRENT_LOGIN = instructor
            print("\nLogin successful.\n\n")
            return
    print("Invalid username or password.")


def logout():
    global CURRENT_LOGIN
    CURRENT_LOGIN = None
    print("\nLogout successful.\n\n")


def findCourse(courseId):
    for course in COURSES:
        if course.courseId == courseId:
            return course
    return None


if __name__ == "__main__":
    nr_dashes = (os.get_terminal_size().columns - len("Welcome to Courshell"))//2
    print(f"\n{'-'*nr_dashes}Welcome to Courshell{'-'*nr_dashes}\n\n")

    while True:
        print("1. Sign Up as User")
        print("2. Sign Up as Instructor")
        print("3. Login as User")
        print("4. Login as Instructor")
        print("5. Exit Program")

        try:
            choice = int(input("\nEnter your choice: "))
        except ValueError:
            print("\nInvalid choice. Please try again.\n\n")
            continue

        if choice == 1:
            signUpUser()
        elif choice == 2:
            signUpInstructor()
        elif choice == 3:
            loginUser()
        elif choice == 4:
            loginInstructor()
        elif choice == 5:
            print("Exiting...")
            exit()
        else:
            print("\nInvalid choice. Please try again.\n\n")
            continue

        if isinstance(CURRENT_LOGIN, User):
            while True:
                print("1. Browse Courses")
                print("2. Enroll Course")
                print("3. View Enrolled Courses")
                print("4. View Course")
                print("5. Change Password")
                print("6. Change Username")
                print("7. Logout")
                print("8. Exit Program")

                try:
                    choice = int(input("\nEnter your choice: "))
                except ValueError:
                    print("\nInvalid choice. Please try again.\n\n")
                    continue

                if choice == 1:
                    CURRENT_LOGIN.browseCourses()
                elif choice == 2:
                    courseId = input("Enter course ID: ")
                    CURRENT_LOGIN.enrollCourse(courseId)
                elif choice == 3:
                    CURRENT_LOGIN.viewEnrolledCourses()
                elif choice == 4:
                    courseId = input("Enter course ID: ")
                    if courseId in CURRENT_LOGIN.enrolledCourseIds:
                        course = findCourse(courseId)
                        if course:
                            print(f"Title: {course.title}")
                            print(f"Description: {course.description}")
                            print(f"Modules:-\n")
                            modules = []
                            for i, moduleId in enumerate(course.moduleIds):
                                module = course.findModule(moduleId)
                                if module:
                                    print(f"Module {i+1}: {module.title}")
                                    modules.append(module)

                            if not modules:
                                print("No modules found.")
                                continue

                            while True:
                                print("1. Enter Module")
                                print("2. Unenroll from Course")
                                print("3. Back to User Menu")
                                print("4. Exit Program")

                                try:
                                    choice = int(input("\nEnter your choice: "))
                                except ValueError:
                                    print("\nInvalid choice. Please try again.\n\n")
                                    continue

                                if choice == 1:
                                    while True:
                                        try:
                                            moduleIndex = int(input("Enter module index: ")) - 1
                                        except ValueError:
                                            print("\nInvalid module index. Please try again.\n\n")
                                            continue

                                        if not (0 <= moduleIndex < len(modules)):
                                            print("\nInvalid module index. Please try again.\n\n")
                                            continue

                                        module = modules[moduleIndex]
                                        print(module.title)
                                        print("Articles:-\n")
                                        articles = []
                                        for i, articleId in enumerate(module.articleIds):
                                            article = module.findArticle(articleId)
                                            if article:
                                                print(f"Article {i+1}: {article.title}")
                                                articles.append(article)

                                        if not articles:
                                            print("No articles found.")
                                            continue

                                        while True:
                                            print("1. Enter Article")
                                            print("2. Back to Module Menu")
                                            print("3. Exit Program")

                                            try:
                                                choice = int(input("\nEnter your choice: "))
                                            except ValueError:
                                                print("\nInvalid choice. Please try again.\n\n")
                                                continue

                                            if choice == 1:
                                                try:
                                                    articleIndex = int(input("\nEnter article index: ")) - 1
                                                except ValueError:
                                                    print("\nInvalid article index. Please try again.\n\n")
                                                    continue

                                                if not (0 <= articleIndex < len(articles)):
                                                    print("\nInvalid article index. Please try again.\n\n")
                                                    continue

                                                article = articles[articleIndex]
                                                nr_dashes = (os.get_terminal_size().columns - len(article.title))//2
                                                print(f"{'-'*nr_dashes}{article.title}{'-'*nr_dashes}")
                                                print(article.content)
                                                print(f"{'-'*(nr_dashes*2 + len(article.title))}")
                                            elif choice == 2:
                                                break
                                            elif choice == 3:
                                                print("Exiting...")
                                                exit()
                                            else:
                                                print("\nInvalid choice. Please try again.\n\n")
                                                continue

                                elif choice == 2:
                                    CURRENT_LOGIN.unenrollCourse(courseId)
                                    break
                                elif choice == 3:
                                    break
                                elif choice == 4:
                                    print("Exiting...")
                                    exit()
                                else:
                                    print("\nInvalid choice. Please try again.\n\n")
                                    continue

                        else:
                            print("Course not found.")
                elif choice == 5:
                    CURRENT_LOGIN.changePassword()
                elif choice == 6:
                    CURRENT_LOGIN.changeUsername()
                elif choice == 7:
                    logout()
                    break
                elif choice == 8:
                    print("Exiting...")
                    exit()
                else:
                    print("\nInvalid choice. Please try again.\n\n")
                    continue

        if isinstance(CURRENT_LOGIN, Instructor):
            while True:
                print("1. Create Course")
                print("2. Remove Course")
                print("3. Change Password")
                print("4. Change Username")
                print("5. View Created Courses")
                print("6. Update Course")
                print("7. Logout")
                print("8. Exit Program")

                try:
                    choice = int(input("\nEnter your choice: "))
                except ValueError:
                    print("\nInvalid choice. Please try again.\n\n")
                    continue

                if choice == 1:
                    CURRENT_LOGIN.createCourse()
                elif choice == 2:
                    try:
                        courseIndex = int(input("Enter course index: ")) - 1
                    except ValueError:
                        print("\nInvalid course index. Please try again.\n\n")
                        continue

                    if not (0 <= courseIndex < len(CURRENT_LOGIN.createdCourseIds)):
                        print("\nInvalid course index. Please try again.\n\n")
                        continue

                    courseId = CURRENT_LOGIN.createdCourseIds[courseIndex]
                    CURRENT_LOGIN.removeCourse(courseId)
                elif choice == 3:
                    CURRENT_LOGIN.changePassword()
                elif choice == 4:
                    CURRENT_LOGIN.changeUsername()
                elif choice == 5:
                    CURRENT_LOGIN.viewCreatedCourses()
                elif choice == 6:
                    try:
                        courseIndex = int(input("Enter course index: ")) - 1
                    except ValueError:
                        print("\nInvalid course index. Please try again.\n\n")
                        continue

                    if not (0 <= courseIndex < len(CURRENT_LOGIN.createdCourseIds)):
                        print("\nInvalid course index. Please try again.\n\n")
                        continue

                    courseId = CURRENT_LOGIN.createdCourseIds[courseIndex]
                    course = findCourse(courseId)

                    if course:
                        nr_dashes = (os.get_terminal_size().columns - len(course.title))//2
                        print(f"{'-'*nr_dashes}{course.title}{'-'*nr_dashes}")

                        while True:
                            print("1. Update Course Title")
                            print("2. Update Course Description")
                            print("3. Add Module")
                            print("4. Remove Module")
                            print("5. View Modules")
                            print("6. Update Module")
                            print("7. Back to Instructor Menu")
                            print("8. Exit Program")

                            try:
                                choice = int(input("\nEnter your choice: "))
                            except ValueError:
                                print("\nInvalid choice. Please try again.\n\n")
                                continue

                            if choice == 1:
                                title = input("Enter new title: ")
                                course.setTitle(title)
                                print("Course title updated successfully.")
                            elif choice == 2:
                                description = input("Enter new description: ")
                                course.description = description
                                print("Course description updated successfully.")
                            elif choice == 3:
                                course.addModule()
                            elif choice == 4:
                                try:
                                    moduleIndex = int(input("Enter module index: ")) - 1
                                except ValueError:
                                    print("\nInvalid module index. Please try again.\n\n")
                                    continue

                                if not (0 <= moduleIndex < len(course.moduleIds)):
                                    print("\nInvalid module index. Please try again.\n\n")
                                    continue

                                moduleId = course.moduleIds[moduleIndex]
                                course.removeModule(moduleId)
                            elif choice == 5:
                                print(f"Modules:-\n")
                                modules = []
                                for i, moduleId in enumerate(course.moduleIds):
                                    module = course.findModule(moduleId)
                                    if module:
                                        print(f"Module {i+1}: {module.title}")
                                        modules.append(module)

                                if not modules:
                                    print("No modules found.")
                                    continue

                            elif choice == 6:
                                modules = []
                                for moduleId in course.moduleIds:
                                    module = course.findModule(moduleId)
                                    if module:
                                        modules.append(module)

                                try:
                                    moduleIndex = int(input("Enter module index: ")) - 1
                                except ValueError:
                                    print("\nInvalid module index. Please try again.\n\n")
                                    continue

                                if not (0 <= moduleIndex < len(modules)):
                                    print("\nInvalid module index. Please try again.\n\n")
                                    continue

                                module = modules[moduleIndex]

                                nr_dashes = (os.get_terminal_size().columns - len(module.title))//2
                                print(f"{'-'*nr_dashes}{module.title}{'-'*nr_dashes}")
                                while True:
                                    print("1. Update Module Title")
                                    print("2. Add Article")
                                    print("3. Remove Article")
                                    print("4. View Articles")
                                    print("5. Update Article")
                                    print("6. Back to Course Menu")
                                    print("7. Exit Program")

                                    try:
                                        choice = int(input("\nEnter your choice: "))
                                    except ValueError:
                                        print("\nInvalid choice. Please try again.\n\n")
                                        continue

                                    if choice == 1:
                                        title = input("Enter new title: ")
                                        module.setTitle(title)
                                        print("Module title updated successfully.")
                                    elif choice == 2:
                                        module.addArticle()
                                    elif choice == 3:
                                        try:
                                            articleIndex = int(input("Enter article index: ")) - 1
                                        except ValueError:
                                            print("\nInvalid article index. Please try again.\n\n")
                                            continue

                                        if not (0 <= articleIndex < len(module.articleIds)):
                                            print("\nInvalid article index. Please try again.\n\n")
                                            continue

                                        articleId = module.articleIds[articleIndex]
                                        module.removeArticle(articleId)
                                    elif choice == 4:
                                        print(f"Articles:-\n")
                                        articles = []
                                        for i, articleId in enumerate(module.articleIds):
                                            article = module.findArticle(articleId)
                                            if article:
                                                articles.append(article)
                                                print(f"Article {i+1}: {article.title}, Optional: {article.isOptional}")
                                    elif choice == 5:
                                        articles = []
                                        for i, articleId in enumerate(module.articleIds):
                                            article = module.findArticle(articleId)
                                            if article:
                                                articles.append(article)

                                        try:
                                            articleIndex = int(input("Enter article index: ")) - 1
                                        except ValueError:
                                            print("\nInvalid article index. Please try again.\n\n")
                                            continue

                                        while True:
                                            print("1. Update Article Title")
                                            print("2. Update Article Duration")
                                            print("3. Update Article Content")
                                            print("4. Set Article Optional")
                                            print("5. Set Article Compulsory")
                                            print("6. Back to Module Menu")
                                            print("7. Exit Program")

                                            try:
                                                choice = int(input("\nEnter your choice: "))
                                            except ValueError:
                                                print("\nInvalid choice. Please try again.\n\n")
                                                continue

                                            if choice == 1:
                                                title = input("Enter new title: ")
                                                article.setTitle(title)
                                                print("Article title updated successfully.")
                                            elif choice == 2:
                                                duration = input("Enter new duration: ")
                                                article.setDuration(duration)
                                                print("Article duration updated successfully.")
                                            elif choice == 3:
                                                content = input("Enter new content:-\n")
                                                article.setContent(content)
                                                print("Article content updated successfully.")
                                            elif choice == 4:
                                                article.setOptional()
                                                print("Article set to optional.")
                                            elif choice == 5:
                                                article.setCompulsory()
                                                print("Article set to compulsory.")
                                            elif choice == 6:
                                                break
                                            elif choice == 7:
                                                print("Exiting...")
                                                exit()
                                            else:
                                                print("\nInvalid choice. Please try again.\n\n")

                                    elif choice == 6:
                                        break
                                    elif choice == 7:
                                        print("Exiting...")
                                        exit()
                                    else:
                                        print("\nInvalid choice. Please try again.\n\n")


                            elif choice == 7:
                                break
                            elif choice == 8:
                                print("Exiting...")
                                exit()
                            else:
                                print("\nInvalid choice. Please try again.\n\n")
                    else:
                        print("Course not found.")

                elif choice == 7:
                    logout()
                    break
                elif choice == 8:
                    print("Exiting...")
                    exit()
                else:
                    print("\nInvalid choice. Please try again.\n\n")
