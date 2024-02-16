#include <iostream>
#include <vector>
#include <string>
#include <ctime>
#include <cstdlib>

class User {
protected:
    std::string username;
    std::string password;

public:
    User(std::string username, std::string password)
        : username(username), password(password) {}

    virtual ~User() {}

    virtual std::string getType() const = 0;

    
    virtual void signUp() = 0;

 
    virtual bool signIn() = 0;
};

// Class for regular users
class RegularUser : public User {
public:
    RegularUser(std::string username, std::string password)
        : User(username, password) {}

    std::string getType() const override {
        return "Regular User";
    }

    void signUp() override {
        std::cout << "Signed up as a Regular User\n";
    }

    bool signIn() override {
        std::cout << "Signed in as a Regular User\n";
        return true;
    }
};

class Instructor : public User {
public:
    Instructor(std::string username, std::string password)
        : User(username, password) {}

    std::string getType() const override {
        return "Instructor";
    }

    void signUp() override {
        std::cout << "Signed up as an Instructor\n";
    }

    bool signIn() override {
        std::cout << "Signed in as an Instructor\n";
        return true;
    }
};


class Course {
private:
    std::string title;
    std::string description;
    std::string courseId;

public:
    Course(std::string title, std::string description)
        : title(title), description(description), courseId(generateCourseID()) {}

    std::string getTitle() const { return title; }

    std::string getCourseId() const { return courseId; }

    // Function to generate a unique course ID
    std::string generateCourseID() const {
        const std::string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const int len = 6;
        std::string id;
        for (int i = 0; i < len; ++i) {
            id += chars[rand() % chars.length()];
        }
        return id;
    }

    void display() const {
        std::cout << "Course ID: " << courseId << std::endl;
        std::cout << "Title: " << title << std::endl;
        std::cout << "Description: " << description << std::endl;
    }
};

class  Courshell {
private:
    std::vector<Course> courses;

public:
    // Function to add a new course
    void addCourse(const Course& course) {
        courses.push_back(course);
    }

    // Function to display all courses
    void displayCourses() const {
        std::cout << "Available Courses:\n";
        for (const auto& course : courses) {
            course.display();
            std::cout << std::endl;
        }
    }
};

int main() {
    // Seed random number generator
    srand(time(nullptr));

    // Creating instances of users
    RegularUser regularUser("user123", "password");
    Instructor instructor("instructor1", "password");

    // Signing up and signing in
    regularUser.signUp();
    regularUser.signIn();

    instructor.signUp();
    instructor.signIn();

    // Creating courses
    Course course1("Mathematics", "Basic mathematics course");
    Course course2("Programming", "Introduction to programming course");
    Course course3("LLD", "Low level design for beginners");
    Course course4("Web Development", "Introduction to Web Dev");

    // Adding courses to the course selling system
    Courshell courseSystem;
    courseSystem.addCourse(course1);
    courseSystem.addCourse(course2);
    courseSystem.addCourse(course3);
    courseSystem.addCourse(course4);

    // Displaying available courses
    courseSystem.displayCourses();

    return 0;
}
