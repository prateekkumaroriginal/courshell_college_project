#include <iostream>
#include <vector>
#include <ctime>
#include <uuid/uuid.h> 

class Article {
private:
    std::string title;
    std::string content;
    int duration;
    std::string moduleId;
    bool isOptional;
    std::string articleId;
    time_t createdAt;

public:
    Article(std::string title, std::string content, int duration, std::string moduleId, bool isOptional = false) {
        this->title = title;
        this->content = content;
        this->duration = duration;
        this->moduleId = moduleId;
        this->isOptional = isOptional;
        this->createdAt = std::time(nullptr);

        // Generate UUID (you may need to use a different method for UUID generation depending on your setup)
        uuid_t uuid;
        uuid_generate(uuid);
        char uuidStr[37];
        uuid_unparse(uuid, uuidStr);
        this->articleId = std::string(uuidStr);
    }

    void setTitle(std::string title) {
        this->title = title;
    }

    void setDuration(int duration) {
        this->duration = duration;
    }

    void setContent(std::string content) {
        this->content = content;
    }

    void setOptional() {
        this->isOptional = true;
    }

    void setCompulsory() {
        this->isOptional = false;
    }
};

class Module {
private:
    std::string title;
    std::string courseId;
    std::string moduleId;
    time_t createdAt;
    std::vector<std::string> articleIds;

public:
    Module(std::string title, std::string courseId) {
        this->title = title;
        this->courseId = courseId;
        this->createdAt = std::time(nullptr);

        // Generate UUID for module
        uuid_t uuid;
        uuid_generate(uuid);
        char uuidStr[37];
        uuid_unparse(uuid, uuidStr);
        this->moduleId = std::string(uuidStr);
    }

    void setTitle(std::string title) {
        this->title = title;
    }

    void addArticle() {
        // Implement addArticle functionality
    }

    void removeArticle(std::string articleId) {
        // Implement removeArticle functionality
    }
};

class Course {
private:
    std::string title;
    std::string description;
    std::string instructorId;
    std::string courseId;
    time_t createdAt;
    std::vector<std::string> moduleIds;

public:
    Course(std::string title, std::string description, std::string instructorId) {
        this->title = title;
        this->description = description;
        this->instructorId = instructorId;
        this->createdAt = std::time(nullptr);

        // Generate UUID for course
        uuid_t uuid;
        uuid_generate(uuid);
        char uuidStr[37];
        uuid_unparse(uuid, uuidStr);
        this->courseId = std::string(uuidStr);
    }

    void setTitle(std::string title) {
        this->title = title;
    }

    void addModule() {
        // Implement addModule functionality
    }

    void removeModule(std::string moduleId) {
        // Implement removeModule functionality
    }
};

class Instructor {
private:
    std::string username;
    std::string password;
    std::string instructorId;
    time_t createdAt;
    std::vector<std::string> createdCourseIds;

public:
    Instructor(std::string username, std::string password) {
        this->username = username;
        this->password = password;
        this->createdAt = std::time(nullptr);

        // Generate UUID for instructor
        uuid_t uuid;
        uuid_generate(uuid);
        char uuidStr[37];
        uuid_unparse(uuid, uuidStr);
        this->instructorId = std::string(uuidStr);
    }

    void createCourse() {
        // Implement createCourse functionality
    }

    void removeCourse(std::string courseId) {
        // Implement removeCourse functionality
    }

    void viewCreatedCourses() {
        // Implement viewCreatedCourses functionality
    }

    void changePassword() {
        // Implement changePassword functionality
    }

    void changeUsername() {
        // Implement changeUsername functionality
    }
};

class User {
private:
    std::string username;
    std::string password;
    std::string userId;
    time_t createdAt;
    std::vector<std::string> enrolledCourseIds;

public:
    User(std::string username, std::string password) {
        this->username = username;
        this->password = password;
        this->createdAt = std::time(nullptr);

        // Generate UUID for user
        uuid_t uuid;
        uuid_generate(uuid);
        char uuidStr[37];
        uuid_unparse(uuid, uuidStr);
        this->userId = std::string(uuidStr);
    }

    void browseCourses() {
        // Implement browseCourses functionality
    }

    void enrollCourse(std::string courseId) {
        // Implement enrollCourse functionality
    }

    void unenrollCourse(std::string courseId) {
        // Implement unenrollCourse functionality
    }

    void changePassword() {
        // Implement changePassword functionality
    }

    void changeUsername() {
        // Implement changeUsername functionality
    }

    void viewEnrolledCourses() {
        // Implement viewEnrolledCourses functionality
    }
};


int main() {
    return 0;
}
